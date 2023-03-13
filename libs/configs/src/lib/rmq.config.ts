import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    exchangeName: configService.get('AMQP_EXCHANGE'),
    connections: [
      {
        login: configService.get('AMQP_LOGIN'),
        password: configService.get('AMQP_PASSWORD'),
        host: configService.get('AMQP_HOST'),
      },
    ],
    queueName: configService.get('AMQP_QUEUE') ?? '',
    serviceName: 'main',
    prefetchCount: 32,
  }),
});
