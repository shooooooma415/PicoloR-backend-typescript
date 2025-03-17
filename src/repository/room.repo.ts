import { Pool } from "pg";
import { RoomMember } from "../model/room.model";

class RoomRepository {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async createRoomMember(user: RoomMember): Promise<RoomMember | null> {
    const query = `
			INSERT INTO room_members (user_id, room_id)
			VALUES ($1, $2)
			RETURNING user_id, room_id
		`;

    try {
      const result = await this.db.query(query, [user.UserID, user.RoomID]);
      const createdRoomMember: RoomMember = {
        UserID: result.rows[0].user_id,
        RoomID: result.rows[0].room_id,
      };
      return createdRoomMember;
    } catch (err) {
      console.error(`failed to create room member: ${err}`);
      return null;
    }
  }
}

export { RoomRepository };
