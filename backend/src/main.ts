import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  // rawBody: true required for Stripe webhook signature verification
  const app = await NestFactory.create(AppModule, { rawBody: true });
  
  // Enable CORS for frontend integration
  app.enableCors();
  
  // Security
  app.use(helmet());
  
  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // allow extra props (webhooks etc)
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
