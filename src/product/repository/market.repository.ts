import { InsertMarketDto } from './../dto/insertMarket.dto';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Market } from "src/product/schemas/market.schema";
import { distinct } from 'rxjs';

@Injectable()
export class MarketRepository {
    constructor(@InjectModel(Market.name) private readonly marketModel: Model<Market>){}
    
    async isExist(marketName: string){
        const isExist = await this.marketModel.exists({ marketName })
        return !isExist?true:false;
    }

    async insertMarket(insertMarketDto: InsertMarketDto){
        await this.marketModel.create(insertMarketDto);
    }

    async findDistinctMarketType() {
        const distinctMarketList = await this.marketModel.find().distinct('marketType').exec()
        console.log(distinctMarketList);
        return distinctMarketList;
    }

    async findCategorizedMarkets(marketType: string) {
        return await this.marketModel.find({ marketType })
    }

}