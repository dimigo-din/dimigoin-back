import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { LaundryTimetable, Student } from "src/schemas";

export type LaundryApplicationDocument = HydratedDocument<LaundryApplication>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

@ApiExtraModels(LaundryTimetable, Student)
@Schema(options)
export class LaundryApplication {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(LaundryTimetable) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "LaundryTimetable",
  })
  timetable: Types.ObjectId;

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
    type: Number,
  })
  time: number;
}

export const LaundryApplicationSchema =
  SchemaFactory.createForClass(LaundryApplication);
