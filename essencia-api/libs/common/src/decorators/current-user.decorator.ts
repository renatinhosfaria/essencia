import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../types/user-payload.type';

export const CurrentUser = createParamDecorator(
  (
    data: keyof UserPayload | undefined,
    ctx: ExecutionContext,
  ): UserPayload | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserPayload;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);
