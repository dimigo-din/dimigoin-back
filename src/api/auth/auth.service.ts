import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/common/dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  Student,
  StudentDocument,
  Teacher,
  TeacherDocument,
  Token,
  TokenDocument,
} from 'src/common/models';
import { UserService } from '../user/user.service';
import { refreshTokenVerified } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,
    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,
    @InjectModel(Token.name)
    private tokenModule: Model<TokenDocument>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async verifyPassword(
    password: string,
    user: StudentDocument | TeacherDocument,
  ): Promise<boolean> {
    return bcrypt.compare(password + user.password_salt, user.password_hash);
  }

  async login(data: LoginDto): Promise<StudentDocument | TeacherDocument> {
    const student = await this.studentModel.findOne({ id: data.id }).lean();
    if (student && (await this.verifyPassword(data.password, student))) {
      return student;
    }

    const teacher = await this.teacherModel.findOne({ id: data.id }).lean();
    if (teacher && (await this.verifyPassword(data.password, teacher))) {
      return teacher;
    }

    throw new HttpException('계정 또는 비밀번호가 잘못되었습니다.', 404);
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
        'refresh토큰이 올바르지 않습니다. 다시 로그인해주세요.',
        404,
      );
    return this.userService.getUserByObjectId(existingToken.userId);
  }

  async verifyRefreshToken(token: string): Promise<refreshTokenVerified> {
    return this.jwtService.verify(token);
  }

  async getAccessToken(user: StudentDocument | TeacherDocument): Promise<any> {
    const refreshKey = crypto.randomBytes(20).toString('hex');
    const payload = { ...user };
    await this.setRefresh({ refreshToken: refreshKey, userId: user._id });
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const refreshToken = this.jwtService.sign(
      { refreshToken: refreshKey },
      { secret: process.env.JWT_SECRET_KEY },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(token: string): Promise<boolean> {
    const existingToken = await this.tokenModule
      .findOneAndDelete({
        refreshToken: token,
      })
      .lean();
    if (!existingToken)
      throw new HttpException(
        'refresh토큰이 올바르지 않습니다. 다시 로그인해주세요.',
        404,
      );
    return true;
  }
}
