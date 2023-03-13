import { IsNumber, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export namespace AccountLoginPhoneVerifyConfirmMessage {
  export const topic = 'account.login-phone-verify-confirm-message.command';

  export class Request {
    @ApiProperty()
    @IsNumber()
    confirmId: number;

    @ApiProperty()
    @IsNumber()
    code: number;
  }

  export class Response {
    accessToken: string;
    refreshToken: string;
  }
}
