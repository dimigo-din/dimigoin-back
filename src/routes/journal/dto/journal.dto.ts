import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString } from "class-validator";

import { IsCustomDate } from "src/common/validators";

export class GetJournalDto {
  @ApiProperty()
  @IsMongoId()
  user: string;
}

export class DeleteJournalDto {
  @ApiProperty()
  @IsMongoId()
  journal: string;
}

export class CreateJournalDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  @IsCustomDate()
  date: string;
}

export class ManageJournal {
  @ApiProperty()
  @IsMongoId()
  journal: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  @IsCustomDate()
  date: string;
}
