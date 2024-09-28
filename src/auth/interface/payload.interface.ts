import { Types } from "mongoose";

import { GradeType, ClassType, GenderType } from "src/lib/types";

export interface DIMIJwtPayload {
  _id: Types.ObjectId;
  name: string;
  email: string;
  grade: GradeType;
  class: ClassType;
  number: number;
  gender: GenderType;
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
