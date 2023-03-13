import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export namespace AccountLogout {
  export const topic = 'account.logout.command';

  export class Request {
    @ApiProperty()
    @IsNumber()
    userId: number;

    refreshToken: string;
  }

  export class Response {
    done: boolean;
  }
}
