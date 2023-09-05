import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { createOpertation } from "src/common/utils";
import { LoginDto, refreshTokenDto } from "src/routes/user/dto";

import { DIMIRefreshPayload } from "../interface";
import { AuthService } from "../providers";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation(
    createOpertation({
      name: "로그인",
      description: "구글 토큰을 이용해 로그인합니다.",
    }),
  )
  @Post("/login")
  async login(@Body() data: LoginDto): Promise<object> {
    const user = await this.authService.googleLogin(data);
    return await this.authService.createToken(user);
  }

  @ApiOperation(
    createOpertation({
      name: "리프레시",
      description: "토큰을 갱신합니다.",
    }),
  )
  @Post("/refresh")
  async refresh(@Body() data: refreshTokenDto): Promise<object> {
    const payload: DIMIRefreshPayload = await this.authService.verify(
      data.token,
    );
    if (!payload.refresh)
      throw new HttpException(
        "Refresh 토큰이 아닙니다.",
        HttpStatus.BAD_REQUEST,
      );
    await this.authService.removeExistingToken(data.token);
    return await this.authService.createToken(payload);
  }

  @ApiOperation(
    createOpertation({
      name: "로그아웃",
      description: "리프레시 토큰을 삭제합니다.",
    }),
  )
  @Post("/logout")
  async logout(@Body() data: refreshTokenDto): Promise<string> {
    await this.authService.verify(data.token);
    await this.authService.removeExistingToken(data.token);
    return "success";
  }
}
