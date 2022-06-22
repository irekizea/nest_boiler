import { Market } from './../schemas/market.schema';
import { PickType } from "@nestjs/swagger";

export class InsertMarketDto extends PickType(Market, [
    'marketType',
    'marketName',
    'marketAdditionalInfo',
  ] as const) {}