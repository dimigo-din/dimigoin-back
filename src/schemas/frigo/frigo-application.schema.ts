import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { StatusValues, StatusType, CurfewValues, CurfewType } from "src/lib";

import { Frigo, Student } from "src/schemas";

export type FrigoApplicationDocument = HydratedDocument<FrigoApplication>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

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
  frigo: string;

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
    enum: CurfewValues,
  })
  curfew: CurfewType;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: StatusValues,
  })
  status: StatusType;
}

export const FrigoApplicationSchema =
  SchemaFactory.createForClass(FrigoApplication);
