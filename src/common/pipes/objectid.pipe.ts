import { HttpException, Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ObjectIdPipe implements PipeTransform<Types.ObjectId> {
  transform(value: Types.ObjectId) {
    if (!Types.ObjectId.isValid(value))
      throw new HttpException("Invalid ObjectId", 400);

    return value;
  }
}
