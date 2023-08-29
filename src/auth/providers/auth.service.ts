import { forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { LoginDto } from "src/routes/user/dto/user.dto";
import { ResponseDto } from "src/common/dto";

import {
  Student,
  StudentDocument,
  Teacher,
  TeacherDocument,
  Token,
  TokenDocument,
} from "src/schemas";
import { refreshTokenVerified } from "src/common/types";
import { UserService } from "src/routes/user/providers/user.service";
import { OAuth2Client, TokenPayload } from "google-auth-library";

import crypto from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,

    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,

    @InjectModel(Token.name)
    private tokenModule: Model<TokenDocument>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly jwtService: JwtService,
  ) {}

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    // TODO: outdated, fixing later
    try {
      const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      );

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      return ticket.getPayload();
    } catch (error) {
      console.log(error);
      throw new HttpException("비정상적인 토큰입니다.", 404);
    }
  }

  async login(data: LoginDto): Promise<StudentDocument | TeacherDocument> {
    const { email } = await this.verifyAccessToken(data.token);

    const student = await this.studentModel.findOne({ email }).lean();
    if (student) {
      return student;
    }

    const teacher = await this.teacherModel.findOne({ email }).lean();
    if (teacher) {
      return teacher;
    }

    throw new HttpException("계정 또는 비밀번호가 잘못되었습니다.", 404);
  }

  async setRefresh(refreshPayload): Promise<boolean> {
    const refreshToken = new this.tokenModule({
      ...refreshPayload,
    });

    await refreshToken.save();

    return true;
  }

  async refresh(token: string): Promise<StudentDocument | TeacherDocument> {
    const existingToken = await this.tokenModule
      .findOneAndDelete({
        refreshToken: token,
      })
      .lean();

    if (!existingToken)
      throw new HttpException(
        "refresh토큰이 올바르지 않습니다. 다시 로그인해주세요.",
        404,
      );

    return await this.userService.getUserByObjectId(existingToken.userId);
  }

  async verifyRefreshToken(token: string): Promise<refreshTokenVerified> {
    return this.jwtService.verify(token);
  }

  async getAccessToken(user: StudentDocument | TeacherDocument): Promise<any> {
    // existing RefreshToken remove
    // await this.tokenModule.findOneAndDelete({
    //   userId: user._id,
    // });

    const refreshKey = crypto.randomBytes(20).toString("hex");
    const payload = { ...user };

    await this.setRefresh({ refreshToken: refreshKey, userId: user._id });

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { refreshToken: refreshKey },
      { expiresIn: "1y" },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(token: string): Promise<ResponseDto> {
    const existingToken = await this.tokenModule
      .findOneAndDelete({
        refreshToken: token,
      })
      .lean();

    if (!existingToken)
      throw new HttpException(
        "refresh토큰이 올바르지 않습니다. 다시 로그인해주세요.",
        404,
      );

    return { statusCode: 200, message: "success" };
  }
}
