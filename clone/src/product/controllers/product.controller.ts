import { UpdateProductDto } from './../dto/updateProduct.dto';
import { RegistProductDto } from './../dto/registProduct.dto';
import { InsertMarketDto } from './../dto/insertMarket.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { GetProductDto } from '../dto/getProduct.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    private readonly productService: ProductService,
  ) {}

  @ApiOperation({ summary: '마켓 등록' })
  @Post('insertMarket')
  async insertMarket(@Body() insertMarketDto: InsertMarketDto) {
    return await this.productService.insertMarket(insertMarketDto);
  }

  @ApiOperation({ summary: '마켓 리스트' })
  @Get('getMarketList')
  async getMarketList() {
    return await this.productService.getMarketList();
  }

  @ApiOperation({ summary: '상품 등록' })
  @UseGuards(AuthGuard('jwt'))
  @Post('registProduct')
  async registProduct(
    @Body() registProductDto: RegistProductDto,
    @Req() req: Request,
  ) {
    //인증된 사용자와 상품 등록자가 같은 경우에만 등록 허용
    this.logger.info('regist product : ', registProductDto);
    if (req.user != registProductDto.userEmail) {
      this.logger.error('unauthorized user request');
      throw new UnauthorizedException();
    } else {
      return await this.productService.registProduct(registProductDto);
    }
  }

  @ApiOperation({ summary: '상품 상세 조회' })
  @Get('getProductDetail')
  async getProductDetail(@Body() getProductDetailDto: GetProductDto) {
    return await this.productService.getProductDetail(getProductDetailDto._id);
  }

  @ApiOperation({ summary: '상품 업데이트' })
  @UseGuards(AuthGuard('jwt'))
  @Put('productUpdate')
  async productUpdate(
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ) {
    // 작성자와 인증받은 수정 요청자와 같은지 확인 후 업데이트
    if (req.user != updateProductDto.userEmail) {
      this.logger.error('unauthorized user request');
      throw new UnauthorizedException();
    } else {
      return await this.productService.updateProduct(updateProductDto);
    }
  }

  @ApiOperation({ summary: '상품 삭제' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('deleteProduct')
  async productDelete(@Body() getProductDetailDto: GetProductDto) {
    // 삭제의 경우 관리자 삭제 고려 해당 프로세스 추가 필요
    this.logger.info('delete product request id : ', getProductDetailDto);
    return await this.productService.deleteProduct(getProductDetailDto._id);
  }

  /**
     * 검색 
     * {
        "productName":"", 상품명
        "category" : "", 카테고리명
        "categoryDetail" : "", 카테고리 상세
        "country" : "미국", 국가명
        "newest" : 1, 최신순 ( 1 최신 -1 오래된 순 0 등록순 상관 없이)
        "imminent" : 0 마감입박 순 ( 1 마감임박, -1 오래 남은순 0 상관 없이)
        최신 우선 처리
        }
     * 
     */
  @ApiOperation({
    summary:
      '상품 검색 {"productName":"제니","category" : "쿠키","categoryDetail":"", "country" : "","newest" : 1, "imminent" : 0}',
  })
  @Get('searchProduct')
  async searchProduct(@Body() searchOption: JSON) {
    return await this.productService.searchProduct(searchOption);
  }
}
