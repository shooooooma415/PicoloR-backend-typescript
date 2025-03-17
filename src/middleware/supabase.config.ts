import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

function loadEnvFile(): void {
  let currentDir = process.cwd();
  while (true) {
    const envPath = path.join(currentDir, ".env");
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      console.log(`.envファイルを${envPath}からロードしました。`);
      return;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }
  throw new Error(".envファイルが見つかりませんでした。");
}

export interface SupabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export async function connectDB(config?: SupabaseConfig): Promise<Pool> {
  if (!process.env.RENDER) {
    try {
      loadEnvFile();
    } catch (err: any) {
      console.warn(`Warning: ${err.message}`);
    }
  }

  let dbConfig: SupabaseConfig;
  if (config) {
    dbConfig = config;
  } else {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;

    if (!host || !port || !user || !password || !database) {
      throw new Error("環境変数に必要なDB接続情報が不足しています。");
    }
    dbConfig = {
      host,
      port: parseInt(port, 10),
      user,
      password,
      database,
    };
  }

  const pool = new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    console.log("Database接続に成功しました。");
  } catch (err: any) {
    throw new Error(`Database接続に失敗しました: ${err.message}`);
  }

  return pool;
}