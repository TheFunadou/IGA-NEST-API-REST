import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Swagger dependences
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: ["http://localhost:5173","http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type,Accept,Authorization",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Swagger documentation config
  const config = new DocumentBuilder()
    .setTitle("IGA REST API")
    .setDescription("Endpoints docs")
    .setVersion("Alpha 1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('iga-api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
