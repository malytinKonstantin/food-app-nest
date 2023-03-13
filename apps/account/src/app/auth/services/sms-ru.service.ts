import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMSRu } from 'node-sms-ru';
import { SMSRuSendSMSResponse } from 'node-sms-ru';

@Injectable()
export class SmsRuService {
  constructor(
    // private readonly smsRu: SMSRu
    private readonly configService: ConfigService
  ) {}

  async sendSms({
    recipient,
    message,
  }: {
    recipient: string;
    message: string;
  }): Promise<SMSRuSendSMSResponse> {
    const smsRu = new SMSRu(
      this.configService.get('SMS_RU_LOGIN'),
      this.configService.get('SMS_RU_PASSWORD')
    );
    const response = await smsRu.sendSms({ to: recipient, msg: message });
    return response;
  }
}
