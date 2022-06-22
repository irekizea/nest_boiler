import { Injectable } from '@nestjs/common';
import { InsertMarketDto } from '../dto/insertMarket.dto';
import { MarketRepository } from '../repository/market.repository';

@Injectable()
export class ProductService {

    constructor (
        private readonly marketRepository: MarketRepository,
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
    
}
