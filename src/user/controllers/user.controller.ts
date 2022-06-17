import { UserService } from './../services/user.service';
import { UserSignUpRequestDto } from '../dto/userSignUpRequest.dto';
import { UserEmailCheckDto } from '../dto/userEmailCheck.dto';
import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/loginrequest.dto';
import { RegistSellerDto } from '../dto/registSeller.dto';

@Controller('user')
@ApiTags('user')
export class UserController {

    constructor (
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ){}
    
    @ApiOperation({ summary : '이메일 중복 체크'})
    @Post('emailCheck')
    @ApiOkResponse({ status: 200, description: '사용가능한 이메일 입니다.'})
    async emailCheck(@Body() userEmailCheckDto: UserEmailCheckDto){
        return await this.userService.emailCheck(userEmailCheckDto.userEmail);
    }

    @ApiOperation({ summary : '회원가입'})
    @Post('signUp')
    async signUp(@Body() userSignUpRequestDto: UserSignUpRequestDto){
        return await this.userService.signUp(userSignUpRequestDto);
    }

    @ApiOperation({ summary : '로그인'})
    @Post('login')
    async login(@Body() loginRequestDto: LoginRequestDto){
        return await this.authService.jwtLogin(loginRequestDto);
    }

    @ApiOperation({ summary : '셀러등록'})
    @Post('registSeller')
    async registSellergin(@Body() registSellerDto: RegistSellerDto){
        await this.userService.registSeller(registSellerDto);
    }

    @ApiOperation({ summary : '셀러 정보 확인'})
    @Post('getSellerInfo')
    async getSellerInfo(@Body() userEmailCheckDto: UserEmailCheckDto){
        return await this.userService.getSellerInfo(userEmailCheckDto.userEmail);
    }

}
