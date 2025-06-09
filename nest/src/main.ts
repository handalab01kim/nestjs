import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformDateInterceptor } from './interceptor/transform-date/transform-date.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { RtspService } from './rtsp/rtsp.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // // React build 정적 파일 서빙
  // app.use(express.static(join(__dirname, '..', 'public', 'build'))); 

  // // React SPA 라우팅 처리 (없는 모든 경로는 index.html로 리다이렉트)
  // app.get('*', (req, res) => {
  //   res.sendFile(join(__dirname, '..', 'public', 'build', 'index.html'));
  // });

  app.get(RtspService);
  
  app.useGlobalPipes(new ValidationPipe()); // api 유효성 검증
  app.useGlobalInterceptors(new TransformDateInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
