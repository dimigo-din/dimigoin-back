import { PassportStrategy } from "@nestjs/passport";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

import { JwtPayload } from "jsonwebtoken";

import { UserService } from "src/routes";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET_KEY"),
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback): Promise<any> {
    if (!payload.ref) {
      //const user = await this.userService.findById(payload.id);
      //if (user) {
      //  return done(null, user);
      // }
    } else {
      throw new HttpException(
        "잘못된 토큰 형식입니다. Access Token을 전달해주세요.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
