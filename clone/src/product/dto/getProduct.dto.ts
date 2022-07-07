import { Product } from '../schemas/product.schema';
import { PickType } from '@nestjs/swagger';

export class GetProductDto extends PickType(Product, ['_id'] as const) {}
