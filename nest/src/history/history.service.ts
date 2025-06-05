import { Injectable } from '@nestjs/common';
import { History } from './history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(History)
        private historyRepository: Repository<History>,
    ) {}

    async getRecent(): Promise<History[]> {
        return this.historyRepository.find({
            order: { idx: 'DESC' },
            take: 6,
        });
    }

  /*
    async getRecent(): Promise<History[]> {
        return this.historyRepository.query(`
            SELECT * FROM history
            ORDER BY idx DESC
            LIMIT 6
        `);
    }

  */
}
