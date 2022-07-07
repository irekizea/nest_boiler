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
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../auth/auth.service';
import { LoginRequestDto } from '../../auth/dto/loginrequest.dto';
import { UserUpdateDto } from '../dto/UserUpdateDto.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetNewAccessToken } from '../dto/getNewAccesToken.dto';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('user')
//예외 처리
@UseFilters(HttpExceptionFilter)
//성공 데이터 처리
@UseInterceptors(SuccessInterceptor)
@ApiTags('user')
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() UserSignUpRequestDto: UserSignUpRequestDto) {
    return null;
  }

  @Get()
  findAll() {
    return null;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return null;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UserUpdateDto: UserUpdateDto) {
    return null;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return null;
  }

  @ApiOperation({ summary: '이메일 중복 체크' })
  @Get('emailCheck')
  @ApiOkResponse({ status: 200, description: '사용가능한 이메일 입니다.' })
  async emailCheck(@Body() userEmailCheckDto: UserEmailCheckDto) {
    return await this.userService.emailCheck(userEmailCheckDto.userEmail);
  }

  @ApiOperation({ summary: '회원가입' })
  @Post('signUp')
  async signUp(@Body() userSignUpRequestDto: UserSignUpRequestDto) {
    return await this.userService.signUp(userSignUpRequestDto);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    return await this.authService.jwtLogin(loginRequestDto);
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
