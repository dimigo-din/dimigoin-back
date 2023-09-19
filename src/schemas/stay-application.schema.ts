import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { SeatValues, Seat } from "src/common/types";

import { Stay, Student } from "src/schemas";

export type StayApplicationDocument = HydratedDocument<StayApplication>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

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
  student: Types.ObjectId;

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
