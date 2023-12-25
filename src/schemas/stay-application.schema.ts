import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { SeatValues, Seat } from "src/common/types";

import { Stay, Student } from "src/schemas";

import { options } from "./options";

export type StayApplicationDocument = HydratedDocument<StayApplication>;
@ApiExtraModels(Stay, Student)
@Schema(options)
export class StayApplication {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Stay) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Stay",
  })
  stay: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Student) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  student: Student;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: SeatValues,
  })
  seat: Seat;

  @ApiProperty()
  @Prop({
    required: false,
    type: String,
  })
  reason: string;
}

export const StayApplicationSchema =
  SchemaFactory.createForClass(StayApplication);
