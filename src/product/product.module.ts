import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './controllers/product.controller';
import { MarketRepository } from './repository/market.repository';
import { ProductRepository } from './repository/product.repository';
import { Market, MarketSchema } from './schemas/market.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductService } from './services/product.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Market.name, schema: MarketSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, MarketRepository]
})
export class ProductModule {}
