import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

import { UserManageService } from "src/routes/user/providers";

import { DIMIJwtPayload } from "../interface";

@Injectable()
export class DIMIJwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly userManageService: UserManageService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET_KEY"),
    });
  }

  async validate(
    payload: DIMIJwtPayload,
    done: VerifiedCallback,
  ): Promise<any> {
    if (!payload.refresh) {
      const user = await this.userManageService.getUserByObjectId(payload._id);
      if (user) {
        return done(null, user);
      }
    } else {
      throw new HttpException(
        "잘못된 토큰 형식입니다. Access Token을 전달해주세요.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
