import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp } from '../libs/common/src/middlewares/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initializeApp(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
