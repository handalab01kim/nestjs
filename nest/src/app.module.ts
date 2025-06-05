import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HistoryModule } from './history/history.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { eventModule } from './websocket/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 .env 사용 가능(main.ts  포함)
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:  process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // 각 모듈에서 imports: [TypeOrmModule.forFeature([EntityName])], 으로 등록
      // entities: [__dirname + '/**/*.entity{.ts,.js}'], // TypeORM 이 구동될 때 인식하도록 할 entity 클래스의 경로 지정
      synchronize: true, // 서비스 구동 시 소스 코드 기반으로 DB 스키마 동기화할지 여부, PROD 에서는 false 로 할 것
    }),
    HistoryModule,
    eventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
