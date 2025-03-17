import { RoomID } from "./auth.model";

export type ColorCode = string;
export type ColorID = number;

export interface Color {
  ColorId: ColorID;
  ColorCode: ColorCode;
  RoomId: RoomID;
}

export interface CreateColor {
  ColorCodes: ColorCode[];
  RoomId: RoomID;
}

export interface getColorRes {
  ColorId: ColorID;
  ColorCode: ColorCode;
}

export interface GetColorResponse {
    themeColors: getColorRes[];
}
