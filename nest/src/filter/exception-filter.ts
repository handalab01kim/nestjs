import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class ConflictExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // PostgreSQL의 unique 위반 에러 코드: 23505
    const isUniqueViolation =
      (exception as any).code === '23505';

    if (isUniqueViolation) {
      return response.status(409).json({
        statusCode: 409,
        message: '이미 존재하는 값입니다.',
        error: 'Conflict',
      });
    }

    // 기본 fallback
    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}

// main.ts

// import { ConflictExceptionFilter } from './filters/conflict-exception.filter';
// app.useGlobalFilters(new ConflictExceptionFilter());