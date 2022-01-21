import { SetMetadata } from '@nestjs/common';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { AuthenticationError } from 'apollo-server-errors';
import { ConfigService } from 'src/config/config.service';
import { AuthService } from './auth.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AppAuthGuard extends NestAuthGuard('jwt') {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _authService: AuthService,
    private readonly _configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this._configService.IS_DEV) {
      const ctx = GqlExecutionContext.create(context).getContext();
      ctx.userId = 'test123';
      return true;
    }
    const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx?.headers?.authorization) {
      throw new AuthenticationError('You must provide token.');
    }
    ctx.userId = await this._authService.verify(ctx.headers.authorization);
    return !!ctx.userId;
  }
}
