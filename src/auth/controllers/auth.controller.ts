import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { LoginDto, refreshTokenDto } from "src/routes/user/dto/user.dto";
import { AuthService } from "../providers/auth.service";

import { DIMIRefreshPayload } from "../interface";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() data: LoginDto): Promise<object> {
    const user = await this.authService.googleLogin(data);
    return await this.authService.createToken(user);
  }

  @Post("/refresh")
  async refresh(@Body() data: refreshTokenDto): Promise<object> {
    const payload: DIMIRefreshPayload = await this.authService.verify(
      data.token,
    );
    if (!payload.refresh)
      throw new HttpException(
        "Refresh 토큰이 아닙니다.",
        HttpStatus.UNAUTHORIZED,
      );
    await this.authService.removeExistingToken(data.token);
    return await this.authService.createToken(payload);
  }

  @Post("/logout")
  async logout(@Body() data: refreshTokenDto): Promise<string> {
    await this.authService.verify(data.token);
    await this.authService.removeExistingToken(data.token);
    return "success";
  }
}
