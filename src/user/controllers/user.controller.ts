import { UserService } from './../services/user.service';
import { UserSignUpRequestDto } from '../dto/userSignUpRequest.dto';
import { UserEmailCheckDto } from '../dto/userEmailCheck.dto';
import { Body, Controller, Post, Req, UseGuards, UnauthorizedException, Put, Delete } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthService } from '../../auth/auth.service';
import { LoginRequestDto } from '../../auth/dto/loginrequest.dto';
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
    @Put('registSeller')
    async registSellergin(@Body() registSellerDto: RegistSellerDto, @Req() req: Request){
        // 인증 유저 이메일과 요청 이메일 일치 여부 확인
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
        
        if(req.user!=userEmailCheckDto.userEmail){
            throw new UnauthorizedException();
        }else{
            return await this.userService.getSellerInfo(userEmailCheckDto.userEmail);
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
            //만료된 accesstoken 이 기존 accesstoken과  다를 경우 refreshtoken 탈취 가정 refreshtoken 삭제
            await this.authService.removeRefreshToken(userInfo.userEmail);
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ summary : '유저삭제'})
    @UseGuards(AuthGuard('jwt'))
    @Delete('deleteUser')
    async deleteUser(@Body() userEmailCheckDto: UserEmailCheckDto, @Req() req: Request){
        if(req.user!=userEmailCheckDto.userEmail){
            return await this.userService.deleteUser(userEmailCheckDto.userEmail);
        }else{
            throw new UnauthorizedException();
        }
    }
}
