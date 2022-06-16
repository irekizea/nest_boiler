import { UserSignUpRequestDto } from './../dto/userSignUpRequest.dto';
import { Injectable, HttpException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schemas/user.shcema";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>){}
    
    //이메일 체크
    async existByEmail(userEmail: string): Promise<boolean> {
        try {
            const result = await this.userModel.exists({ userEmail });
            return result?true:false;
        } catch (error) {
            throw new HttpException('DB Error', 400);
        }
    }

    //회원 가입
    async signUpUser (user: UserSignUpRequestDto): Promise<User>{
        return await this.userModel.create(user);
    }
}