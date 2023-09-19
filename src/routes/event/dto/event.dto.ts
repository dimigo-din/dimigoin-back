import { ApiProperty } from "@nestjs/swagger";

import { Event } from "src/schemas";

export class GetEventResponse {
  @ApiProperty({
    type: [Event],
  })
  events: Event[];

  @ApiProperty()
  type: number;
}
