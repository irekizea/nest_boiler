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
        ){}

    async login(data: LoginRequestDto){

        const { userEmail, password } = data;

        const user = await this.userRepository.findUserByEmail(userEmail);

        if (!user) {
            throw new UnauthorizedException('로그인 정보를 확인해 주세요');
        }

        const isPasswordValidated: boolean = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPasswordValidated) {
            throw new UnauthorizedException('로그인 정보를 확인해 주세요');
        }
        const payload = { userEmail : userEmail};

        return {
            token: this.jwtService.sign(payload),
        }

    }

}
