import { Types } from "mongoose";

import { UserType, Grade, Class, Gender } from "src/common/types";

export interface DIMIJwtPayload {
  _id: Types.ObjectId;
  type: UserType;
  name: string;
  email: string;
  grade: Grade;
  class: Class;
  number: number;
  gender: Gender;
  permissions: string[];
  groups: {
    _id: Types.ObjectId;
    permissions: string[];
  }[];
  created_at: Date;
  updated_at: Date;
  refresh: boolean;
}

export interface DIMIRefreshPayload {
  _id: Types.ObjectId;
  refresh: boolean;
}
