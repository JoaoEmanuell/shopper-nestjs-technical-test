import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { json } from 'express';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Shopper node technical test API')
    .setDescription('Api for shopper node technical test')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.use(json({ limit: '10mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      enableDebugMessages: true,
      stopAtFirstError: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const firstError = validationErrors[0];
        return new BadRequestException({
          error_code: 'INVALID_DATA',
          error_description: Object.values(firstError.constraints).join(', '),
        });
      },
    }),
  );

  await app.listen(8080);
}
// setup
const databasePath = './src/database';
const imagesPath = './src/database/images';

if (!existsSync(databasePath)) {
  mkdirSync(databasePath); // create the database dir if not exists
}
if (!existsSync(imagesPath)) {
  mkdirSync(imagesPath); // create the tmp dir if not exists
}
if (!existsSync(`${databasePath}/db.sqlite`)) {
  writeFileSync(`${databasePath}/db.sqlite`, ''); // create a empty db file
}

bootstrap();
