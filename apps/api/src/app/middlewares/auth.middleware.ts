import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '@apps/account/src/app/token/token.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authhorizationHeader = req.headers.authorization;
      if (!authhorizationHeader) {
        return next(new UnauthorizedException('Пользователь не авторизован'));
      }

      const accessToken = authhorizationHeader.split(' ')[1];
      if (!accessToken) {
        return next(new UnauthorizedException('Пользователь не авторизован'));
      }

      const userData = this.tokenService.validateAccessToken(accessToken);
      if (!userData) {
        return next(new UnauthorizedException('Пользователь не авторизован'));
      }

      req.user = userData;

      return next();
    } catch (err) {
      return next(err);
    }
  }
}
