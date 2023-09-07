import { Types } from "mongoose";

import { Grade, Class, Gender } from "src/common/types";

export interface DIMIJwtPayload {
  _id: Types.ObjectId;
  name: string;
  email: string;
  grade: Grade;
  class: Class;
  number: number;
  gender: Gender;
  permissions: object;
  groups: string[];
  created_at: Date;
  updated_at: Date;
  refresh: boolean;
}

export interface DIMIRefreshPayload {
  _id: Types.ObjectId;
  refresh: boolean;
}
