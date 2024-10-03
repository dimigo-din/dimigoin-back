import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

import { CurfewType, CurfewValues } from "src/lib";

export class ApplyFrigoRequestDto {
  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsString()
  @IsIn(CurfewValues)
  curfew: CurfewType;
}
