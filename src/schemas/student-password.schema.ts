import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { Student } from "src/schemas";

export type StudentPasswordDocument = HydratedDocument<StudentPassword>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

@ApiExtraModels(Student)
@Schema(options)
export class StudentPassword {
  @ApiProperty()
  _id: Types.ObjectId;

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
  password: string;
}

export const StudentPasswordSchema =
  SchemaFactory.createForClass(StudentPassword);
