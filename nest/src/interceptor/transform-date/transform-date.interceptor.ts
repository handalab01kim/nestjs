import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function convertDates(obj: any): any {
  if (obj instanceof Date) {
    return dayjs(obj).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  } else if (Array.isArray(obj)) {
    return obj.map(convertDates);
  } else if (obj && typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      result[key] = convertDates(obj[key]);
    }
    return result;
  }
  return obj;
}

@Injectable()
export class TransformDateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => convertDates(data)));
  }
}
