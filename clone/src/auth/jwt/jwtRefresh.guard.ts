import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    super.logIn(request);
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
