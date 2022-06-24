import { ProductRepository } from './../repository/product.repository';
import { Injectable } from '@nestjs/common';
import { InsertMarketDto } from '../dto/insertMarket.dto';
import { RegistProductDto } from '../dto/registProduct.dto';
import { MarketRepository } from '../repository/market.repository';
import { UpdateProductDto } from '../dto/updateProduct.dto';

@Injectable()
export class ProductService {
    constructor (
        private readonly marketRepository: MarketRepository,
        private readonly productRepository: ProductRepository
    ){}
    
    async insertMarket(insertMarketDto: InsertMarketDto) {
        const existCheck = await this.marketRepository.isExist(insertMarketDto.marketName);
        if(existCheck){
            return await this.marketRepository.insertMarket(insertMarketDto);
        }else {
            return "해당 마켓 이름이 이미 존재합니다."
        }
    }

    async getMarketList() {
        const distinctMarketList = await this.marketRepository.findDistinctMarketType();
        let marketList = [];
        let marketJson = {};
        let markets ={}

        for(const distinctMarket of distinctMarketList){
            marketJson = {};
            markets ={}
            markets = await this.marketRepository.findCategorizedMarkets(distinctMarket);
            marketJson[distinctMarket] = markets;
            marketList.push(marketJson)
        }
        return marketList;
    }
    
    async registProduct(registProductDto: RegistProductDto) {
        return await this.productRepository.registProduct(registProductDto);
    }

    async getProductDetail(productId: string) {
        return await this.productRepository.getProductDetail(productId);
    }

    async updateProduct(updateProductDto: UpdateProductDto) {
        return await this.productRepository.updateProduct(updateProductDto);
    }

    async deleteProduct(_id: string) {
        return await this.productRepository.deleteProduct(_id);
    }

    async searchProduct(searchOption: JSON) {

        let searchResult

        if(searchOption["newest"]!=0){
            searchOption["newest"] = searchOption["newest"] * -1;
            searchResult = await this.productRepository.searhcProductOrderByRegDate(searchOption);
        }else if(searchOption["imminent"]!=0){
            searchResult = await this.productRepository.searhcProductOrderByImminet(searchOption);
        }else{
            searchResult = await this.productRepository.searhcProduct(searchOption);
        }

        return searchResult;
    }
}
