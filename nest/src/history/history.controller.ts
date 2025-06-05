import { Controller, Get, Post, Body, Inject, Param, Res } from '@nestjs/common';
import { HistoryService } from './history.service';
import { Response } from 'express'; 
import * as path from 'path';  // Node.js 기본 모듈 import 방식
import { HistoryDto } from 'src/history/history.dto';

@Controller('api/history')
export class HistoryController {
    @Inject()
    private readonly historyService: HistoryService;

    constructor(){}

    @Get("recent")
    getRecent():any{
        return this.historyService.getRecent();
    }

    // 이미지 get
    @Get('image/:filename')
    getImage(@Param('filename') filename: string, @Res() res: Response) {
        const imagePath = path.join(process.cwd(), '..', 'images', filename);
        return res.sendFile(imagePath);
    }

    // @Post()
    // createHistory(@Body() dto: historyDto){
    //     return this.historyService.createHistory(dto);
    // }
}
