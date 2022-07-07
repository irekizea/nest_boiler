import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { UserRepository } from '../../user/repository/user.repository';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: Payload) {
    const user = await this.userRepository.findUserByEmail(payload.userEmail);

    if (user) {
      return user.accessToken;
    } else {
      throw new UnauthorizedException();
    }
  }
}
