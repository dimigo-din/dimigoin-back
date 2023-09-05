import { ObjectId } from "mongoose";

import { GradeValues, ClassValues, GenderValues } from "src/common/types";

export interface DIMIJwtPayload {
  _id: ObjectId; // 유저의 ObjectID
  name: string;
  email: string;
  grade: (typeof GradeValues)[number];
  class: (typeof ClassValues)[number];
  number: number;
  gender: (typeof GenderValues)[number];
  permissions: object;
  groups: string[];
  created_at: Date;
  updated_at: Date;
  refresh: boolean; // 유저의 Refresh Token
}

export interface DIMIRefreshPayload {
  _id: ObjectId; // 유저의 ObjectID
  refresh: boolean; // 유저의 Refresh Token
}
