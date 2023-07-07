import { HttpException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export async function DIMIJwtExpireMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.path.startsWith('/auth')) {
    const token = req.headers.authorization;
    if (!token) throw new HttpException('JWT 토큰이 전달되어여 합니다.', 404);
    try {
      const decodedToken = await this.jwtService.verifyAsync(token);

      if (decodedToken && decodedToken.exp) {
        if (decodedToken.exp * 1000 <= Date.now())
          throw new HttpException('JWT 토큰이 만료되었습니다.', 401);

        req.user = decodedToken;
      }
    } catch (error) {
      throw new HttpException('JWT 토큰이 올바르지 않습니다.', 404);
    }
  }
  next();
}
