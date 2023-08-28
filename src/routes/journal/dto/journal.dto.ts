import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString } from "class-validator";

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
  @IsMongoId()
  user: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  date: Date;
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
  date: Date;
}
