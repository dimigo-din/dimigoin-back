import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { StatusValues, Status } from "src/common";

import { Frigo, Student } from "src/schemas";

import { options } from "./options";

export type FrigoApplicationDocument = HydratedDocument<FrigoApplication>;
@ApiExtraModels(Frigo, Student)
@Schema(options)
export class FrigoApplication {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Frigo) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Frigo",
  })
  frigo: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Student) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  student: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  reason: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: StatusValues,
  })
  status: Status;
}

export const FrigoApplicationSchema =
  SchemaFactory.createForClass(FrigoApplication);
