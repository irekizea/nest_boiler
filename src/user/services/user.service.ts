import { UserRepository } from './../repository/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSignUpRequestDto } from '../dto/userSignUpRequest.dto';
import { Model } from 'mongoose';
import { User } from '../schemas/user.shcema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository){}

    // 이메일 중복 체크
    async emailCheck(userEmail: string) {
        console.log(userEmail)
        const isEmailExist = await this.userRepository.existByEmail(userEmail);
        console.log(isEmailExist);

        if(isEmailExist){
            throw new UnauthorizedException('해당 이메일은 이미 사용중 입니다');
        }
        return "사용 가능한 이메일 입니다"
    }
    
    // 회원가입
    async signUp(body: UserSignUpRequestDto) {
        const {
             userEmail, 
             password, 
             name, 
             countryCode, 
             socialType, 
             socialKey, 
             smsAllow, 
             emailAllow 
            } = body;

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await this.userRepository.signUpUser({
            userEmail,
            password: hashedPassword,
            name,
            countryCode,
            socialType,
            socialKey,
            smsAllow,
            emailAllow
        });

        return user.readOnlyData;

    }
}
