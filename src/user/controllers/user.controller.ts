import { UserService } from './../services/user.service';
import { UserSignUpRequestDto } from '../dto/userSignUpRequest.dto';
import { UserEmailCheckDto } from '../dto/userEmailCheck.dto';
import { Body, Controller, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/loginrequest.dto';
import { RegistSellerDto } from '../dto/registSeller.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetNewAccessToken } from '../dto/getNewAccesToken.dto';

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
    @UseGuards(AuthGuard('jwt'))
    @Post('registSeller')
    async registSellergin(@Body() registSellerDto: RegistSellerDto, @Req() req: Request){
        // 인증 유저 이메일과 요청 이메일 일치 여부 확인
        console.log('come check')
        console.log(req.user + '   ' + registSellerDto.userEmail)
        if(req.user===registSellerDto.userEmail){
            return await this.userService.registSeller(registSellerDto);
        }else{
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ summary : '셀러 정보 확인'})
    @UseGuards(AuthGuard('jwt'))
    @Post('getSellerInfo')
    async getSellerInfo(@Body() userEmailCheckDto: UserEmailCheckDto, @Req() req: Request){
        if(req.user===userEmailCheckDto.userEmail){
            return await this.userService.getSellerInfo(userEmailCheckDto.userEmail);
        }else{
            throw new UnauthorizedException();
        }
    }
    
    @ApiOperation({ summary : 'accesstoken 갱신'})
    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('setNewAccessToken')
    async setNewAccessToken(@Body() userInfo: GetNewAccessToken, @Req() req: Request){
        if(req.user===userInfo.accessToken){
            const payload:JSON = <JSON><unknown>{
                userEmail : userInfo.userEmail,
               };
            return await this.authService.setNewAccessToken(payload);
        }else{
            throw new UnauthorizedException();
        }
    }

}
