import { ConfigService } from '@nestjs/config';
import { SMSRuNestModuleAsyncOptions } from 'node-sms-ru/dist/types/nestjs';

export const getSmsRuConfig = (): SMSRuNestModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => {
      return {
        api_id: configService.get('SMS_RU_API_ID'),
        login: configService.get('SMS_RU_LOGIN'),
        password: configService.get('SMS_RU_PASSWORD'),
      };
    },
    inject: [ConfigService],
  };
};
