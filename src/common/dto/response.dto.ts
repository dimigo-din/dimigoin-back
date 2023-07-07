import { IsNumber } from 'nestjs-swagger-dto';

export class ResponseDto {
  @IsNumber({ description: '응답 코드', example: 0 })
  status: number;
}
