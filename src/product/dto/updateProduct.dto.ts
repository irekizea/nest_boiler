import { Product } from './../schemas/product.schema';
import { PickType } from '@nestjs/swagger';

export class UpdateProductDto extends PickType(Product, [
  '_id',
  'userEmail',
  'productName',
  'thumbnailList',
  'category',
  'categoryDetail',
  'country',
  'optionType',
  'optionList',
  'price',
  'productDescription',
  'productWarning',
  'purchasedDate',
  'purchasedLocation',
  'lastOrderDate',
  'deliveryType',
  'deliveryMethod',
  'deliveryDate',
] as const) {}
