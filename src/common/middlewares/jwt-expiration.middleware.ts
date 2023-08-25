import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DIMIJwtExpireMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = await this.jwtService.verifyAsync(token);
        req.user = decoded;

        next();
      } catch (err) {
        res
          .status(401)
          .json({ message: 'JWT 토큰이 올바르지 않거나 만료되었습니다.' });
      }
    } else {
      res.status(401).json({
        message: 'JWT 토큰을 Bearer Token 형식으로 넣어서 전달해주세요.',
      });
    }
  }
}
