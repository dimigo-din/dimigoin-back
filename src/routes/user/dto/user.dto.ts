import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import {
  StayApplication,
  StayOutgo,
  FrigoApplication,
  LaundryApplication,
} from "src/schemas";

export class GetApplicationResponse {
  @ApiProperty({
    type: LaundryApplication,
  })
  laundry: LaundryApplication;

  @ApiProperty({
    type: FrigoApplication,
  })
  frigo: FrigoApplication;

  @ApiProperty({
    type: StayApplication,
  })
  stay: StayApplication;

  @ApiProperty({
    type: [StayOutgo],
  })
  stayOutgos: StayOutgo[];
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  readonly token: string;
}
