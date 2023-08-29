import { ObjectId } from "mongoose";

export interface DIMIJwtPayload {
  _id: ObjectId; // 유저의 ObjectID
  name: string;
  email: string;
  grade: number;
  class: number;
  number: number;
  gender: string;
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
