import { SuccessInterceptor } from './../../common/interceptors/success.interceptor';
import { HttpExceptionFilter } from '../../common/exceptions/http-exception.filter';
import { UserService } from './../services/user.service';
import { UserSignUpRequestDto } from '../dto/userSignUpRequest.dto';
import { UserEmailCheckDto } from '../dto/userEmailCheck.dto';
import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
  Put,
  Delete,
  Get,
  Inject,
  UseFilters,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../../auth/auth.service';
import { LoginRequestDto } from '../../auth/dto/loginrequest.dto';
import { RegistSellerDto } from '../dto/registSeller.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetNewAccessToken } from '../dto/getNewAccesToken.dto';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('user')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
@ApiTags('user')
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 인자 값 인트로 변환
  @ApiOperation({ summary: '번호 체크' })
  @Get('numTest/:id')
  @ApiResponse({
    status: 200,
    description: '정상 요청',
  })
  @ApiResponse({
    status: 500,
    description: '내부 오류',
  })
  async numTest(@Param('id', ParseIntPipe) param: number) {
    console.log(typeof param);
    return 'asd';
  }

  @ApiOperation({ summary: '이메일 중복 체크' })
  @Get('emailCheck')
  @ApiOkResponse({ status: 200, description: '사용가능한 이메일 입니다.' })
  async emailCheck(@Body() userEmailCheckDto: UserEmailCheckDto) {
    this.logger.info('email check: ', userEmailCheckDto);
    return await this.userService.emailCheck(userEmailCheckDto.userEmail);
  }

  @ApiOperation({ summary: '회원가입' })
  @Post('signUp')
  async signUp(@Body() userSignUpRequestDto: UserSignUpRequestDto) {
    this.logger.info('signUp Request: ', userSignUpRequestDto);
    return await this.userService.signUp(userSignUpRequestDto);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    this.logger.info('login request email: ', loginRequestDto.userEmail);
    return await this.authService.jwtLogin(loginRequestDto);
  }

  @ApiOperation({ summary: '셀러등록' })
  @UseGuards(AuthGuard('jwt'))
  @Put('registSeller')
  async registSellergin(
    @Body() registSellerDto: RegistSellerDto,
    @Req() req: Request,
  ) {
    // 인증 유저 이메일과 요청 이메일 일치 여부 확인
    this.logger.info('regist seller info: ', registSellerDto);
    if (req.user === registSellerDto.userEmail) {
      return await this.userService.registSeller(registSellerDto);
    } else {
      this.logger.error('not matched user name in regist seller request');
      throw new UnauthorizedException();
    }
  }

  @ApiOperation({ summary: '셀러 정보 확인' })
  @UseGuards(AuthGuard('jwt'))
  @Get('getSellerInfo')
  async getSellerInfo(
    @Body() userEmailCheckDto: UserEmailCheckDto,
    @Req() req: Request,
  ) {
    if (req.user != userEmailCheckDto.userEmail) {
      throw new UnauthorizedException();
    } else {
      return await this.userService.getSellerInfo(userEmailCheckDto.userEmail);
    }
  }

  @ApiOperation({ summary: 'accesstoken 갱신' })
  @UseGuards(AuthGuard('jwt-refresh'))
  @Put('setNewAccessToken')
  async setNewAccessToken(
    @Body() userInfo: GetNewAccessToken,
    @Req() req: Request,
  ) {
    if (req.user === userInfo.accessToken) {
      const payload: JSON = <JSON>(<unknown>{
        userEmail: userInfo.userEmail,
      });
      return await this.authService.setNewAccessToken(payload);
    } else {
      //만료된 accesstoken 이 기존 accesstoken과  다를 경우 refreshtoken 탈취 가정 refreshtoken 삭제
      await this.authService.removeRefreshToken(userInfo.userEmail);
      throw new UnauthorizedException();
    }
  }

  @ApiOperation({ summary: '유저삭제' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('deleteUser')
  async deleteUser(@Body() userEmailCheckDto: UserEmailCheckDto) {
    return await this.userService.deleteUser(userEmailCheckDto.userEmail);
  }
}
