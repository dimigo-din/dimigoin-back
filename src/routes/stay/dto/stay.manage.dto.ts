import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsMongoId,
  IsObject,
  IsString,
  IsIn,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";
import { Types } from "mongoose";
import { Seats, SeatValues, StatusValues } from "@src/common/types";
import { IsCustomDate, IsCustomDateTime } from "@src/common/validators";
