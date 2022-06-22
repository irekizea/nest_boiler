import { Prop, Schema, SchemaFactory, SchemaOptions, } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
} from 'class-validator';
import { Document, Types } from 'mongoose';

export type MarketDocument = Market & Document;

const options: SchemaOptions =  {
  timestamps: true,
}

@Schema(options)
export class Market {


  @ApiProperty({
    example: 'jklsdlf23slsdf',
    description: '마켓 고유 번호',
  })
  @Prop({default:Types.ObjectId})
  _id: Types.ObjectId;

  @ApiProperty({
    example: 'category //  country',
    description: '마켓 타입',
  })
  @Prop({ 
    required: true, 
  })
  @IsNotEmpty()
  marketType: string;

  @ApiProperty({
    example: '스낵/음료/시럼 // 미국',
    description: '카테고리',
  })
  @Prop({ 
    required: true, 
    unique: true 
  })
  @IsNotEmpty()
  marketName: string;

  @ApiProperty({
    example: '["과자/스낵바", "초콜릿"] // 이미지주소.img',
    description: '해당 마켓 추가 정보, type 이 category 일 경우 세부 카테고리 리스트, 국가 일 경우 이미지 주소 추가 마켓 분류가 생길 경우 해당 분류에 추가 정보',
  })
  @Prop({ required: true })
  @IsString()
  marketAdditionalInfo: string;


  readonly readOnlyData:{
    marketType: string;
    marketName: string
    marketAdditionalInfo: string;
  }


}

export const MarketSchema = SchemaFactory.createForClass(Market);

MarketSchema.virtual('readOnlyData').get(function (this: Market){
  return {
    marketType: this.marketType,
    marketName: this.marketName,
    marketAdditionalInfo: this.marketAdditionalInfo,
  }
})