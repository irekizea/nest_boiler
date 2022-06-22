import { UserSignUpRequestDto } from './../dto/userSignUpRequest.dto';
import { Injectable, HttpException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { RegistSellerDto } from '../dto/registSeller.dto';

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

    // email 로 유저 찾기
    async findUserByEmail(userEmail: string) {
        const user = await this.userModel.findOne({ userEmail });
        return user;
    }

    //셀러 등록
    async registSeller(registSellerDto: RegistSellerDto) {
        const userEmail = registSellerDto.userEmail;
        return await this.userModel.updateOne(
            {userEmail},
            {
                isSeller: true,
                sellerName: registSellerDto.sellerName,
                bank: registSellerDto.bank, 
                accountNumber: registSellerDto.accountNumber, 
                anotherContactNum: registSellerDto.anotherContactNum
            }    
        )
    }

    async getSellerInfoByEmail(userEmail: string) {
        const user = await this.userModel.findOne({ userEmail });
        return user.sellerInfoData;
    }


    async updateAccessToken(userEmail: string, accessToken: string){
        await this.userModel.updateOne({userEmail}, {accessToken: accessToken});
    }

    async updateRefreshToken(userEmail: string, refreshToken: string){
        await this.userModel.updateOne({userEmail}, {refreshToken: refreshToken});
    }


}