import { Pool } from "pg";
import { User, UserName, UserID } from "../model/auth.model";

class AuthRepositoryImpl {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async createUser(userName: UserName): Promise<User | null> {
    const query = `
			INSERT INTO users (name) 
			VALUES ($1)
			RETURNING id, name
		`;

    try {
      const result = await this.db.query(query, [userName]);
      const createdUser: User = result.rows[0];
      return createdUser;
    } catch (err) {
      console.error("failed to create user:", err);
      return null;
    }
  }

  async deleteUserByUserID(userID: UserID): Promise<User | null> {
    const query = `
			DELETE FROM users 
			WHERE id = $1
			RETURNING id, name
		`;

    try {
      const result = await this.db.query(query, [userID]);
      const deletedUser: User = result.rows[0];
      return deletedUser;
    } catch (err) {
      console.error("failed to delete user:", err);
      return null;
    }
  }

  async findUserByUserID(userID: UserID): Promise<User | null> {
    const query = `
			SELECT id, name
			FROM users
			WHERE id = $1
		`;

    try {
      const result = await this.db.query(query, [userID]);
      const foundUser: User = result.rows[0];
      return foundUser;
    } catch (err) {
      console.error("failed to find user:", err);
      return null;
    }
  }
}

export { AuthRepositoryImpl };
