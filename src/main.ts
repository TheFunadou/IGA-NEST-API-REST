import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Swagger dependences
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
