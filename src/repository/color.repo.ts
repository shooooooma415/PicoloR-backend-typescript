import { Pool } from "pg";
import { RoomID } from "../model/auth.model";
import { Color, ColorID } from "../model/color.model";

class ColorRepository {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async deleteThemeColors(roomID: RoomID): Promise<RoomID | null> {
    const query = `
      DELETE FROM room_colors
      WHERE room_id = $1
      RETURNING room_id
    `;

    try {
      const result = await this.db.query(query, [roomID]);
      if (result.rows.length > 0) {
        return result.rows[0].room_id;
      } else {
        return null;
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`failed to delete theme colors: ${err.message}`);
      } else {
        throw new Error(`failed to delete theme colors: ${String(err)}`);
      }
    }
  }

  async findThemeColorsByRoomID(roomID: RoomID): Promise<Color[]> {
    const query = `
      SELECT id, color, room_id
      FROM room_colors
      WHERE room_id = $1
    `;

    try {
      const result = await this.db.query(query, [roomID]);
      return result.rows.map((row) => ({ ColorId: row.id, ColorCode: row.color, RoomId: row.room_id }));
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`failed to get theme colors: ${err.message}`);
      } else {
        throw new Error(`failed to get theme colors: ${String(err)}`);
      }
    }
  }

  async findThemeColorByColorID(colorID: ColorID): Promise<Color | null> {
    const query = `
      SELECT id, color, room_id
      FROM room_colors
      WHERE id = $1
    `;

    try {
      const result = await this.db.query(query, [colorID]);
      if (result.rows.length > 0) {
        return { ColorId: result.rows[0].id, ColorCode: result.rows[0].color, RoomId: result.rows[0].room_id };
      } else {
        return null;
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`failed to get theme color: ${err.message}`);
      } else {
        throw new Error(`failed to get theme color: ${String(err)}`);
      }
    }
  }
}

export { ColorRepository };
