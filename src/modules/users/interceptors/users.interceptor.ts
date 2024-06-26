import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<User[]>,
  ): Observable<User[]> | Promise<Observable<User[]>> {
    return next
      .handle()
      .pipe(
        map((data) =>
          data.map((user) =>
            plainToInstance(User, user, { excludeExtraneousValues: true }),
          ),
        ),
      );
  }
}
