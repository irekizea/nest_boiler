import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Market } from "src/product/schemas/market.schema";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(Market.name) private readonly userModel: Model<Market>){}
    
}