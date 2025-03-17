import { RoomID, UserID } from "./auth.model";

export interface Room {
  RoomID: RoomID;
  IsStart: boolean;
  IsFinish: boolean;
  StartAt: Date;
}

export interface RoomMember {
  RoomID: RoomID;
  UserID: UserID;
}
