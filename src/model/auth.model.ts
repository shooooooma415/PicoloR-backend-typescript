export interface User {
  id: UserID;
  name: UserName;
}

export type UserName = string;
export type UserID = number;

export type RoomID = number;