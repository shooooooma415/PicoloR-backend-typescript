import express from "express";
import { connectDB } from "./middleware/supabase.config";

const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    console.log("Database接続に成功しました。");
  } catch (err: any) {
    console.error(`Database接続に失敗しました: ${err.message}`);
    process.exit(1); // 接続に失敗した場合、プロセスを終了する
  }

  app.listen(port, () => {
    console.log(`サーバーがポート${port}で起動しました。`);
  });
}

startServer();
