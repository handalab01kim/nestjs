import { Module } from '@nestjs/common';
import { eventGateway } from './event.gateway';
import { HistoryService } from 'src/history/history.service';
import { HistoryModule } from 'src/history/history.module';

@Module({
    imports: [HistoryModule],
    providers: [eventGateway], // historyService? DI issue
})
export class eventModule {}
