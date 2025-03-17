import { ColorRepository } from "../repository/color.repo";
import { RoomID } from "../model/auth.model";
import { Color } from "../model/color.model";

export class ColorService {
  private colorRepo: ColorRepository;

  constructor(colorRepo: ColorRepository) {
    this.colorRepo = colorRepo;
  }

  async getThemeColors(roomId: RoomID): Promise<Color[]> {
    const colorIDs = await this.colorRepo.findColorIDsByRoomID(roomId);
    const themeColors: Color[] = [];
    for (const colorID of colorIDs ?? []) {
      const color = await this.colorRepo.findThemeColorByColorID(colorID);
      if (color) {
        themeColors.push(color);
      }
    }
    return themeColors;
  }
}
