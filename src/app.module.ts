import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 .env 사용 가능(main.ts  포함)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
