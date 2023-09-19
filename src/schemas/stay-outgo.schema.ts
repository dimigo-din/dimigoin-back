import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { StatusValues, Status } from "src/common";

import { Stay, Student } from "src/schemas";

export type StayOutgoDocument = HydratedDocument<StayOutgo>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@ApiExtraModels(Stay, Student)
@Schema(options)
export class StayOutgo {
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
  @ApiProperty()
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  student: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: Boolean,
  })
  free: boolean;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  date: string;

  @ApiProperty()
  @Prop({
    required: false,
    type: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  })
  duration: { start: string; end: string };

  @ApiProperty()
  @Prop({
    required: true,
    type: {
      breakfast: { type: Boolean, required: true },
      lunch: { type: Boolean, required: true },
      dinner: { type: Boolean, required: true },
    },
  })
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean };

  @ApiProperty()
  @Prop({
    required: false,
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

export const StayOutgoSchema = SchemaFactory.createForClass(StayOutgo);
