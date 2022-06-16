import { UserService } from './../services/user.service';
import { UserSignUpRequestDto } from '../dto/userSignUpRequest.dto';
import { UserEmailCheckDto } from '../dto/userEmailCheck.dto';
import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiOperation,
  } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {

    constructor (
        private readonly userService: UserService,
        private readonly authSErvice: AuthService,
    ){}
    
    @ApiOperation({ summary : '이메일 중복 체크'})
    @Post('emailCheck')
    @ApiOkResponse({ status: 200, description: '사용가능한 이메일 입니다.'})
    async emailCheck(@Body() body:UserEmailCheckDto){
        return await this.userService.emailCheck(body.userEmail);
    }

    @ApiOperation({ summary : '회원가입'})
    @Post('signUp')
    async signUp(@Body() body:UserSignUpRequestDto){
    
        console.log(body)
        return await this.userService.signUp(body);
    }

    @ApiOperation({ summary : '로그인'})
    @Post('login')
    async login(@Body() body:UserSignUpRequestDto){
    
        console.log(body)
        return await this.userService.signUp(body);
    }
}
