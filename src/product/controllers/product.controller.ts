import { InsertMarketDto } from './../dto/insertMarket.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';

@Controller('product')
export class ProductController {
    
    constructor (
        private readonly productService: ProductService,
    ){}

    @ApiOperation({ summary : '마켓 등록'})
    @Post('insertMarket')
    async insertMarket(@Body() insertMarketDto: InsertMarketDto){
        return await this.productService.insertMarket(insertMarketDto);

    }

    @ApiOperation({ summary : '마켓 리스트'})
    @Post('getMarketList')
    async getMarketList(){
        return await this.productService.getMarketList();
    }

}
