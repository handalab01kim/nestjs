import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformDateInterceptor } from './interceptor/transform-date/transform-date.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformDateInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
