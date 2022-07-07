import { Product } from './../schemas/product.schema';
import { PickType } from '@nestjs/swagger';

export class RegistProductDto extends PickType(Product, [
  'userEmail',
  'productName',
  'sellerName',
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
