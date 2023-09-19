import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { OAuth2Client } from "google-auth-library";
import { Model } from "mongoose";

import { LoginDto } from "src/routes/user/dto";
import { UserManageService } from "src/routes/user/providers";

import {
  StudentDocument,
  TeacherDocument,
  Token,
  TokenDocument,
} from "src/schemas";

import { TokensResponse } from "../dto";
import { DIMIJwtPayload, DIMIRefreshPayload } from "../interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userManageService: UserManageService,

    @InjectModel(Token.name)
    private tokenModule: Model<TokenDocument>,
  ) {}

  googleOAuthClient = new OAuth2Client(
    this.configService.get<string>("GOOGLE_CLIENT_ID"),
    this.configService.get<string>("GOOGLE_CLIENT_SECRET"),
  );

  googleOAuthClientWeb = new OAuth2Client(
    this.configService.get<string>("GOOGLE_CLIENT_ID"),
    this.configService.get<string>("GOOGLE_CLIENT_SECRET"),
    "postmessage",
  );

  async googleLogin(
    data: LoginDto,
  ): Promise<StudentDocument | TeacherDocument> {
    try {
      const { tokens } = await this.googleOAuthClient.getToken(data.token);

      const ticket = await this.googleOAuthClient.verifyIdToken({
        idToken: tokens.id_token,
      });
      const payload = ticket.getPayload();
      return await this.userManageService.getUserByEmail(payload.email);
    } catch (error) {
      throw new HttpException(
        "인증되지 않은 토큰입니다.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async googleWebLogin(
    data: LoginDto,
  ): Promise<StudentDocument | TeacherDocument> {
    try {
      const { tokens } = await this.googleOAuthClientWeb.getToken(data.token);

      const ticket = await this.googleOAuthClient.verifyIdToken({
        idToken: tokens.id_token,
      });
      const payload = ticket.getPayload();
      return await this.userManageService.getUserByEmail(payload.email);
    } catch (error) {
      throw new HttpException(
        "인증되지 않은 토큰입니다.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async removeExistingToken(token: string): Promise<void> {
    const existingToken = await this.tokenModule
      .findOneAndDelete({
        refreshToken: token,
      })
      .lean();

    if (!existingToken)
      throw new HttpException(
        "Refresh 토큰이 올바르지 않습니다. 다시 로그인해주세요.",
        HttpStatus.UNAUTHORIZED,
      );
  }

  async verify(token: string): Promise<DIMIJwtPayload | DIMIRefreshPayload> {
    try {
      const payload: DIMIJwtPayload | DIMIRefreshPayload =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>("JWT_SECRET_KEY"),
        });
      return payload;
    } catch (err) {
      if (err.name == "TokenExpiredError") {
        throw new HttpException(
          "토큰이 만료되었습니다.",
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        "인증되지 않은 토큰입니다.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async createToken(
    payload:
      | StudentDocument
      | TeacherDocument
      | DIMIJwtPayload
      | DIMIRefreshPayload,
  ): Promise<TokensResponse> {
    const user = await this.userManageService.getUserByObjectId(payload._id);

    const accessToken = await this.jwtService.signAsync(
      { ...user, refresh: false },
      {
        algorithm: "HS512",
        secret: this.configService.get<string>("JWT_SECRET_KEY"),
        expiresIn: "30m",
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { _id: user._id, refresh: true },
      {
        algorithm: "HS512",
        secret: this.configService.get<string>("JWT_SECRET_KEY"),
        expiresIn: "1y",
      },
    );

    await new this.tokenModule({ refreshToken, userId: user._id }).save();

    return {
      accessToken,
      refreshToken,
    };
  }
}
