import { InsertMarketDto } from './../dto/insertMarket.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('product')
export class ProductController {


    @ApiOperation({ summary : '마켓 등록'})
    @Post('insertMarket')
    async insertMarket(@Body() insertMarketDto: InsertMarketDto){
        console.log(insertMarketDto);
        // return await this.userService.emailCheck(userEmailCheckDto.userEmail);
    }

    @ApiOperation({ summary : '이메일 중복 체크'})
    @Post('registProduct')
    async emailCheck(@Body() test: any){
        // return await this.userService.emailCheck(userEmailCheckDto.userEmail);
    }

}
