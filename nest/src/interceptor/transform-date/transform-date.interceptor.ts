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

function convertDates(obj: any, seen = new WeakSet()): any {
  if (obj instanceof Date) {
    return dayjs(obj).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  } else if (obj && typeof obj === 'object') {
    if (seen.has(obj)) return obj; // 이미 본 객체면 다시 처리 안 함
    seen.add(obj);

    if (Array.isArray(obj)) {
      return obj.map(item => convertDates(item, seen));
    }

    const result = {};
    for (const key in obj) {
      result[key] = convertDates(obj[key], seen);
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
