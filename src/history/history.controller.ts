import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('api/history')
export class HistoryController {
    @Inject()
    private readonly historyService: HistoryService;

    constructor(){}

    @Get("recent")
    getRecent():any{
        return this.historyService.getRecent();
    }
}
