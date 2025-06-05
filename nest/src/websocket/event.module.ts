import { Module } from '@nestjs/common';
import { eventGateway } from './event.gateway';
import { HistoryController } from 'src/history/history.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [eventGateway], // 의존성 정의
})
export class eventModule {}
