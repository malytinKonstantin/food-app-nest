import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export namespace AccountLoginPhoneRetryConfirmMessage {
  export const topic = 'account.login-phone-retry-confirm-message.command';

  export class Request {
    @ApiProperty()
    @IsNumber()
    confirmId: number;
  }

  export class Response {
    @ApiProperty()
    confirmId: number;
  }
}
