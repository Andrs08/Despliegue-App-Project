import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()

    .setTitle('Banana Monitoring API')

    .setDescription('API for banana crop monitoring and management')

    .setVersion('1.0')

    .addBearerAuth()

    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
