import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // --- DYNAMIC CORS ---
  // This reads the allowed origin from .env, or defaults to localhost
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // --- SERVE UPLOADED IMAGES ---
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // --- DYNAMIC PORT ---
  // Most hosts (like Heroku or Railway) tell you which port to use via process.env.PORT
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`🚀 Batcave Server running on: http://localhost:${port}`);
  console.log(`🔓 Allowing CORS for: ${frontendUrl}`);
}
bootstrap();