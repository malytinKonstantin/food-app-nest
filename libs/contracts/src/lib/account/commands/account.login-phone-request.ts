import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export namespace AccountLoginPhoneRequest {
  export const topic = 'account.login-phone-request.command';

  export class Request {
    @ApiProperty()
    @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
    phoneNumber: string;
  }

  export class Response {
    @ApiProperty()
    confirmId: number;
  }
}
