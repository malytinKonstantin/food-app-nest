export namespace AccountRefresh {
  export const topic = 'account.refresh.command';

  export class Request {
    refreshToken: string;
  }

  export class Response {
    accessToken: string;
    refreshToken: string;
  }
}
