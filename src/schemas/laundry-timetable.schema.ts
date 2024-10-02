import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { GradeValues, GenderValues, GradeType, GenderType } from "src/lib";

import { Laundry, Student } from "src/schemas";

export type LaundryTimetableDocument = HydratedDocument<LaundryTimetable>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

@ApiExtraModels(Student)
@Schema(options)
export class LaundryTimetableSequence {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Student) }],
  })
  @Prop({
    type: Types.ObjectId,
    ref: "Student",
  })
  applicant: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  timetable: string;
}

export const LaundryTimetableSequenceSchema = SchemaFactory.createForClass(
  LaundryTimetableSequence,
);

@ApiExtraModels(Laundry)
@Schema(options)
export class LaundryTimetable {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Laundry) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Laundry",
  })
  laundry: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: [LaundryTimetableSequenceSchema],
  })
  sequence: LaundryTimetableSequence[];

  @ApiProperty()
  @Prop({
    required: true,
    type: [Number],
    enum: GradeValues,
  })
  grade: GradeType;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: GenderValues,
  })
  gender: GenderType;

  @ApiProperty()
  @Prop({
    required: true,
    type: Boolean,
  })
  isStaySchedule: boolean;
}

export const LaundryTimetableSchema =
  SchemaFactory.createForClass(LaundryTimetable);
