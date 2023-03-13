import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appPrefix = 'api';
  app.setGlobalPrefix(appPrefix);
  const port = process.env.PORT;
  const config = new DocumentBuilder()
    .setTitle('Food city API')
    .setDescription('author telegram: @belsky1745')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.use(cookieParser());
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${appPrefix}`);
}

bootstrap();
