import { Module } from '@nestjs/common';
import { eventGateway } from './event.gateway';

@Module({
  providers: [eventGateway],
})
export class eventModule {}
