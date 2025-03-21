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

export interface PostMemberRequest {
	roomID: RoomID;
    userID: UserID;
}

export interface DeleteUserRequest {
	userID: UserID;
}