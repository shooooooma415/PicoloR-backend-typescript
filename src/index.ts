import express, { Request, Response } from "express";
import { connectDB } from "./middleware/supabase.config";
import { AuthService } from "./service/auth.service";
import { ColorService } from "./service/color.service";
import { AuthRepository } from "./repository/auth.repo";
import { RoomRepository } from "./repository/room.repo";
import { ColorRepository } from "./repository/color.repo";
import {
  PostUserRequest,
  PostUserResponse,
  PostMemberRequest,
  DeleteUserRequest,
} from "./model/auth.model";
import { RoomMember } from "./model/room.model";
import { GetColorResponse } from "./model/color.model";
import { corsMiddleware } from "./middleware/cors";

const app = express();
app.use(express.json());
app.use(corsMiddleware);
const port = process.env.PORT || 3000;
let authService: AuthService;
let colorService: ColorService;

async function startServer() {
  try {
    const db = await connectDB();
    console.log("connect to Database");

    const userRepo = new AuthRepository(db);
    const roomRepo = new RoomRepository(db);
    const colorRepo = new ColorRepository(db);
    authService = new AuthService(userRepo, roomRepo);
    colorService = new ColorService(colorRepo);

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
      res.status(200).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.delete(
  "/controller/user",
  async (req: Request<{}, {}, DeleteUserRequest>, res) => {
    try {
      const deletedUser = await authService.deleteUserByUserID(req.body.userID);
      res.status(200).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.get("/controller/color", async (req, res: Response<GetColorResponse | { error: string }>) => {
  try {
    const roomId = parseInt(req.query.roomID as string);
    const color = await colorService.getThemeColors(roomId);
    res.status(200).json({ themeColors: color });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

startServer();
