import express, { Request, Response } from "express";
import { connectDB } from "./middleware/supabase.config";
import { AuthService } from "./service/auth.service";
import { AuthRepository } from "./repository/auth.repo";
import { RoomRepository } from "./repository/room.repo";
import {
  PostUserRequest,
  PostUserResponse,
  PostMemberRequest,
} from "./model/auth.model";
import { RoomMember } from "./model/room.model";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
let authService: AuthService;

async function startServer() {
  try {
    await connectDB();
    const db = await connectDB();
    console.log("connect to Database");

    const userRepo = new AuthRepository(db);
    const roomRepo = new RoomRepository(db);
    authService = new AuthService(userRepo, roomRepo);

    app.listen(port, () => {
      console.log(`サーバーがポート${port}で起動しました。`);
    });
  } catch (err) {
    console.error(err);
  }
}

app.post(
  "/controller/user",
  async (
    req: Request<{}, {}, PostUserRequest>,
    res: Response<PostUserResponse | { error: string }>
  ) => {
    try {
      const result = await authService.createUser(req.body.userName);
      res.status(200).json({ userID: result?.id ?? 0 });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.post(
  "/controller/room",
  async (req: Request<{}, {}, PostMemberRequest>, res) => {
    try {
      const roomMember: RoomMember = {
        RoomID: req.body.roomID,
        UserID: req.body.userID,
      };
      await authService.registerMember(roomMember);
      res.status(200);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.delete("/controller/room", async (req, res) => {
  try {
    const deletedUser = await authService.deleteUserByUserID(req.body);
    res.status(200).json(deletedUser?.id);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

startServer();
