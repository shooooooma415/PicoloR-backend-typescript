import express from "express";
import { connectDB } from "./middleware/supabase.config";
import { AuthService } from "./service/auth.service";
import { AuthRepository } from "./repository/auth.repo";
import { RoomRepository } from "./repository/room.repo";

const app = express();
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
    process.exit(1);
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log(`サーバーがポート${port}で起動しました。`);
  });
}

app.post("/controller/user", async (req, res) => {
  try {
    const result = await authService.createUser(req.body.name);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/controller/room", async (req, res) => {
  try {
    const result = await authService.registerMember(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/controller/room", async (req, res) => {
  try {
    const deletedUser = await authService.deleteUserByUserID(req.body);
    res.status(200).json(deletedUser?.id);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

startServer();
