import { HttpException } from '@nestjs/common';
import { UserRepository } from './../user/repository/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dto/loginrequest.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { userEmail, password } = data;

    const user = await this.userRepository.findUserByEmail(userEmail);
    if (!user) {
      throw new UnauthorizedException('로그인 정보를 확인해 주세요');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('로그인 정보를 확인해 주세요');
    }
    const payload: JSON = <JSON>(<unknown>{
      userEmail: userEmail,
    });

    const refreshToken = user.refreshToken
      ? user.refreshToken
      : await this.setNewRefreshToken(payload);

    return {
      userBasicInfo: user.basicInfoData,
      accessToken: await this.setNewAccessToken(payload),
      refreshToken: refreshToken,
    };
  }

  async setNewAccessToken(payload: JSON) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXP,
    });

    await this.userRepository.updateAccessToken(
      payload['userEmail'],
      accessToken,
    );

    return accessToken;
  }

  async setNewRefreshToken(payload: JSON) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXP,
    });

    await this.userRepository.updateRefreshToken(
      payload['userEmail'],
      refreshToken,
    );

    return refreshToken;
  }

  async removeRefreshToken(userEmail: string) {
    await this.userRepository.removeRefreshToken(userEmail);
  }
}
