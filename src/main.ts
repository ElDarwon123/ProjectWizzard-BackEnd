import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // configuración para env
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(ConfigService);
  const PORT = config.get<number>('PORT') || process.env.PORT;
  const uri = config.get<string>('URI');
  await app.listen(PORT);
  console.log(`http://localhost:${PORT}`);
}
bootstrap();
