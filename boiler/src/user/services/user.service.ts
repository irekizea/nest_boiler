import { HttpException } from '@nestjs/common';
import { UserRepository } from './../repository/user.repository';
import { Injectable } from '@nestjs/common';
import { UserSignUpRequestDto } from '../dto/userSignUpRequest.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // 이메일 중복 체크
  async emailCheck(userEmail: string) {
    const isEmailExist = await this.userRepository.existByEmail(userEmail);

    if (isEmailExist) {
      throw new HttpException('해당 이메일은 이미 사용중 입니다', 405);
    }
    return '사용 가능한 이메일 입니다';
  }

  // 회원가입
  async signUp(body: UserSignUpRequestDto) {
    const { userEmail, password, name } = body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userRepository.signUpUser({
      userEmail,
      password: hashedPassword,
      name,
    });
    return user.readOnlyData;
  }

  //유저 삭제
  async deleteUser(userEmail: string) {
    return await this.userRepository.deleteUser(userEmail);
  }
}
