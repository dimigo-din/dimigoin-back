import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { createOpertation } from "src/common/utils";
import { LoginDto, RefreshTokenDto } from "src/routes/user/dto";

import { TokensResponse } from "../dto";
import { DIMIRefreshPayload } from "../interface";
import { AuthService } from "../providers";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation(
    createOpertation({
      name: "테스트",
      description: "서버가 살아있는지 확인합니다.",
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @Get("/ping")
  async ping(): Promise<string> {
    return "pong";
  }

  @ApiOperation(
    createOpertation({
      name: "로그인",
      description: "구글 토큰을 이용해 로그인합니다.",
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokensResponse,
  })
  @Post("/login")
  async login(@Body() data: LoginDto): Promise<TokensResponse> {
    const user = await this.authService.googleLogin(data);
    return await this.authService.createToken(user);
  }

  @ApiOperation(
    createOpertation({
      name: "웹 로그인",
      description: "구글 토큰을 이용해 로그인합니다.",
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokensResponse,
  })
  @Post("/login/web")
  async loginWeb(@Body() data: LoginDto): Promise<TokensResponse> {
    const user = await this.authService.googleWebLogin(data);
    return await this.authService.createToken(user);
  }

  @ApiOperation(
    createOpertation({
      name: "리프레시",
      description: "토큰을 갱신합니다.",
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokensResponse,
  })
  @Post("/refresh")
  async refresh(@Body() data: RefreshTokenDto): Promise<TokensResponse> {
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
  async logout(@Body() data: RefreshTokenDto): Promise<string> {
    await this.authService.verify(data.token);
    await this.authService.removeExistingToken(data.token);
    return "success";
  }
}
