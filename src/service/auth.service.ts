import { AuthRepository } from "../repository/auth.repo";
import { User } from "../model/auth.model";
import { RoomMember } from "../model/room.model";
import { RoomRepository } from "../repository/room.repo";

export class AuthService {
  private authRepo: AuthRepository;
  private roomRepo: RoomRepository;

  constructor(authRepo: AuthRepository,roomRepo: RoomRepository) {
    this.authRepo = authRepo;
    this.roomRepo = roomRepo;
  }

  async createUser(userName: string): Promise<User | null> {
    return this.authRepo.createUser(userName);
  }

  async deleteUserByUserID(userID: number): Promise<User | null> {
    return this.authRepo.deleteUserByUserID(userID);
  }

  async registerMember(roomMember: RoomMember): Promise<RoomMember | null> {
    return this.roomRepo.createRoomMember(roomMember);
  }
}
