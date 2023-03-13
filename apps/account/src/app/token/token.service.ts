import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { TokenModel } from './token.model';
import { TokenEntity } from '@apps/account/src/app/token/token.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(TokenModel)
    private readonly tokenRepository: typeof TokenModel
  ) {}

  generateTokens(payload: { id: number }) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: number, refreshToken: string) {
    const token = await this.tokenRepository.findOne({ where: { userId } });
    if (token) {
      const tokenEntity = new TokenEntity(token).setRefreshToken(refreshToken);
      return await token.update(tokenEntity);
    }
    const newToken = await this.tokenRepository.create({ userId, refreshToken });
    return newToken;
  }

  async removeToken(refreshToken: string) {
    const token = await this.findToken(refreshToken);
    if (token) {
      await token.destroy();
      return true;
    }
    return false;
  }

  async findToken(refreshToken: string) {
    const token = await this.tokenRepository.findOne({ where: { refreshToken } });
    return token;
  }

  validateAccessToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      return userData;
    } catch (e) {
      return null;
    }
  }
}
