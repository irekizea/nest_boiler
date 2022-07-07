import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //벨리데이션 적용
  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * whitelist: dto 속성만 받기
       * forbidNonwhitelisted: 정의 되지 않은값 error 발생
       */
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  //swagger 설정
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Boilerplate')
    .setDescription('sample')
    .setVersion('1.0.0')
    .addTag('boiler')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
