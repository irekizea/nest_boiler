import { AuthService } from 'src/auth/auth.service';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(req, payload: any) {
    console.log('check')
    console.log(req)
    // const payload = { uid: uid,  nickname: nickname, subscribeStatus: subscribeStatus, purchaseDate: purchaseDate, expiresDate:expiresDate };
    const refreshToken = req.cookies?.Refresh;
    return true;
  }
}