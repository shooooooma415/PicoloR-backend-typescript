export interface User {
  id: UserID;
  name: UserName;
}

export type UserName = string;
export type UserID = number;

export type RoomID = number;


export interface PostUserRequest {
	userName: UserName;
}

export interface PostUserResponse {
	userID: UserID;
}