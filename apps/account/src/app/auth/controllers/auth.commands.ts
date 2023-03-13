import { Controller } from '@nestjs/common';
import {
  AccountLoginPhoneRequest,
  AccountLoginPhoneRetryConfirmMessage,
  AccountLoginPhoneVerifyConfirmMessage,
  AccountLogout,
  AccountRefresh,
} from '@libs/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AuthService } from '../auth.service';

@Controller()
export class AuthCommandsController {
  constructor(private readonly authService: AuthService) {}

  @RMQValidate()
  @RMQRoute(AccountLoginPhoneRequest.topic)
  async loginPhoneRequest({
    phoneNumber,
  }: AccountLoginPhoneRequest.Request): Promise<AccountLoginPhoneRequest.Response> {
    return this.authService.loginRequest(phoneNumber);
  }

  @RMQValidate()
  @RMQRoute(AccountLoginPhoneVerifyConfirmMessage.topic)
  async loginPhoneVerifyConfirmMessage({ confirmId, code }: AccountLoginPhoneVerifyConfirmMessage.Request) {
    return this.authService.loginCheckCode(confirmId, code);
  }

  @RMQValidate()
  @RMQRoute(AccountLoginPhoneRetryConfirmMessage.topic)
  async loginPhoneRetryConfirmMessage({
    confirmId,
  }: AccountLoginPhoneRetryConfirmMessage.Request): Promise<AccountLoginPhoneRetryConfirmMessage.Response> {
    return this.authService.loginRetryCode(confirmId);
  }

  @RMQValidate()
  @RMQRoute(AccountLogout.topic)
  async logout({ refreshToken }: AccountLogout.Request): Promise<AccountLogout.Response> {
    return this.authService.logout(refreshToken);
  }

  @RMQValidate()
  @RMQRoute(AccountRefresh.topic)
  async refresh({ refreshToken }: AccountRefresh.Request) {
    return this.authService.refresh(refreshToken);
  }
}
