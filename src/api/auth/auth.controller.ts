import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, refreshTokenDto } from 'src/common/dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() data: LoginDto): Promise<any> {
    const user = await this.authService.login(data);
    return await this.authService.getAccessToken(user);
  }

  @Post('/refresh')
  async refresh(@Body() data: refreshTokenDto): Promise<any> {
    const refresh = await this.authService.verifyRefreshToken(data.token);
    const user = await this.authService.refresh(refresh.refreshToken);
    return await this.authService.getAccessToken(user);
  }

  @Post('/logout')
  async logout(@Body() data: refreshTokenDto): Promise<ResponseDto> {
    const refresh = await this.authService.verifyRefreshToken(data.token);
    return await this.authService.logout(refresh.refreshToken);
  }
}
