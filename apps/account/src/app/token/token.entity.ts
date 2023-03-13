import { IToken } from '@libs/interfaces';

export class TokenEntity implements IToken {
  userId: number;
  refreshToken: string;

  constructor(token: IToken) {
    this.userId = token.userId;
    this.refreshToken = token.refreshToken;
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
    return this;
  }
}
