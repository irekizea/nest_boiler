import { UserSignUpRequestDto } from './../dto/userSignUpRequest.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  //이메일 체크
  async existByEmail(userEmail: string): Promise<boolean> {
    const result = await this.userModel.exists({ userEmail });
    return result ? true : false;
  }

  //회원 가입
  async signUpUser(user: UserSignUpRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }

  // email 로 유저 찾기
  async findUserByEmail(userEmail: string) {
    const user = await this.userModel.findOne({ userEmail });
    return user;
  }

  async updateAccessToken(userEmail: string, accessToken: string) {
    await this.userModel.updateOne({ userEmail }, { accessToken: accessToken });
  }

  async updateRefreshToken(userEmail: string, refreshToken: string) {
    await this.userModel.updateOne(
      { userEmail },
      { refreshToken: refreshToken },
    );
  }

  async deleteUser(userEmail: string) {
    return await this.userModel.findOneAndDelete({ userEmail: userEmail });
  }

  async removeRefreshToken(userEmail: string) {
    await this.userModel.updateOne({ userEmail }, { refreshToken: null });
  }
}
