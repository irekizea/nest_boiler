import { UserRepository } from './../../user/repository/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: true,
    });
  }

  async validate(payload: Payload) {
    const user = await this.userRepository.findUserByEmail(payload.userEmail);

    if (user) {
      return payload.userEmail;
    } else {
      throw new UnauthorizedException();
    }
  }
}
