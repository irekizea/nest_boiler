import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "../schemas/product.schema";
import { RegistProductDto } from "../dto/registProduct.dto";
import { UpdateProductDto } from "../dto/updateProduct.dto";

@Injectable()
export class ProductRepository {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>){}
 
    async registProduct(registProductDto: RegistProductDto) {
        return await this.productModel.create(registProductDto);
    }

    async getProductDetail(productId: string) {
        const result = await this.productModel.findById(productId);
        return result
    }

    async updateProduct(updateProductDto: UpdateProductDto) {
        const product = await this.productModel.findById(updateProductDto._id);
        product.productName=updateProductDto.productName;
        await this.productModel.updateOne({product})
        await this.productModel.findOneAndUpdate({ _id: updateProductDto._id },{
            productName: updateProductDto.productName,
            thumbnailList: updateProductDto.thumbnailList,
            category: updateProductDto.category ,
            categoryDetail: updateProductDto.categoryDetail ,
            country: updateProductDto.country ,
            optionType: updateProductDto.optionType ,
            optionList: updateProductDto.optionList ,
            price: updateProductDto.price ,
            productDescription: updateProductDto.productDescription ,
            productWarning: updateProductDto.productWarning ,
            purchasedDate: updateProductDto.purchasedDate ,
            lastOrderDate: updateProductDto.lastOrderDate ,
            deliveryType: updateProductDto.deliveryType ,
            deliveryDate: updateProductDto.deliveryDate ,
        })
    }

    async deleteProduct(_id: string) {
        await this.productModel.findOneAndDelete({_id})
    }

    async searhcProduct(searchOption: JSON) {
        const searchResult = await this.productModel.find({
            productName:{$regex: '.*' + searchOption["productName"] + '.*' },
            category:{$regex: '.*' + searchOption["category"] + '.*' },
            categoryDetail:{$regex: '.*' + searchOption["categoryDetail"] + '.*' },
            country:{$regex: '.*' + searchOption["country"] + '.*' },
        })
        return searchResult;
    }

    async searhcProductOrderByRegDate(searchOption: JSON) {
        const searchResult = await this.productModel.find({
            productName:{$regex: '.*' + searchOption["productName"] + '.*' },
            category:{$regex: '.*' + searchOption["category"] + '.*' },
            categoryDetail:{$regex: '.*' + searchOption["categoryDetail"] + '.*' },
            country:{$regex: '.*' + searchOption["country"] + '.*' },
        }).sort({createdAt:searchOption["newest"]})
        return searchResult;
    }

    async searhcProductOrderByImminet(searchOption: JSON) {
        const searchResult = await this.productModel.find({
            productName:{$regex: '.*' + searchOption["productName"] + '.*' },
            category:{$regex: '.*' + searchOption["category"] + '.*' },
            categoryDetail:{$regex: '.*' + searchOption["categoryDetail"] + '.*' },
            country:{$regex: '.*' + searchOption["country"] + '.*' },
        }).sort({lastOrderDate:searchOption["imminent"]})
        return searchResult;
    }


}