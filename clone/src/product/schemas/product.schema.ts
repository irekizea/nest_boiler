import { Prop, Schema, SchemaFactory, SchemaOptions, } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsNotEmpty, 
  IsNumber, 
  IsString, 
} from 'class-validator';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

const options: SchemaOptions =  {
  timestamps: true,
}

@Schema(options)
export class Product {

  @ApiProperty({
    example: 'jklsdlf23slsdf',
    description: '상품 고유 번호',
  })
  @IsString()
  @Prop({default:Types.ObjectId})
  _id: string;

  @ApiProperty({
    example: 'sample@croket.com',
    description: '셀러 이메일',
  })
  @Prop({ 
    required: true, 
  })
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({
    example: '영쿡',
    description: '셀러 이름',
  })
  @Prop({ 
    required: true, 
  })
  @IsNotEmpty()
  sellerName: string;

  @ApiProperty({
    example: '제니쿠키',
    description: '상품 이름',
  }) 
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    example: '[3123.jpg, 5235235.jpg, 1112312.jpg]',
    description: '상품 썸네일 리스트',
    default: '[]',
  })
  @Prop({ default: [] })
  @IsString()
  thumbnailList: [];

  @ApiProperty({
    example: '스낵/음료/시럽 // 영국',
    description: '카테고리',
  })
  @Prop()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    example: '과자/스낵바 // sdjklfslf.jpg',
    description: '세부 카테고리',
  })
  @Prop()
  @IsString()
  categoryDetail: string;

  @ApiProperty({
    example: '영국',
    description: '국가 명',
  })
  @Prop()
  @IsString()
  country: string;

  @ApiProperty({
    example: 'singleOption // groupOption',
    description: '옵션 타입',
  })
  @Prop()
  @IsString()
  optionType: string;

  @ApiProperty({
    example: '[{"optionName":사이즈, "optionValue":"M", "optionQuantity":10}, {"optionName":사이즈, "optionValue":"M", "optionQuantity":10}]',
    description: '옵션 리스트',
  })
  @Prop()
  @IsString()
  optionList: [];

  @ApiProperty({
    example: '3000',
    description: '가격',
  })
  @Prop()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '홍콩에서 판매되는 이 쿠키는 ...',
    description: '상품 설명',
  })
  @Prop()
  @IsString()
  productDescription: string;

  @ApiProperty({
    example: '유통기한 확인해 주시고..',
    description: '상품 유의사항',
  })
  @Prop()
  @IsString()
  productWarning: string;

  @ApiProperty({
    example: '1655944393631',
    description: '구매일',
  })
  @Prop()
  @IsNumber()
  purchasedDate: number;

  @ApiProperty({
    example: '상세정보.txt',
    description: '상세 정보 파일 이름',
    default: 'null',
  })
  @Prop({ default: "null"})
  @IsString()
  detailInfoFile: string;

  @ApiProperty({
    example: '서울, 한국',
    description: '구매 지역',
  })
  @Prop({ default: 0 })
  @IsString()
  purchasedLocation: string;
  
  @ApiProperty({
    example: '서울, 한국',
    description: '구매 지역',
  })
  @Prop({ default: 0 })
  @IsNumber()
  lastOrderDate: number;

  @ApiProperty({
    example: '["inner", "direct"] // ["foreign"]',
    description: '배송 방법',
  })
  @Prop()
  @IsString()
  deliveryType: [];

  @ApiProperty({
    example: '{"deliveryOption":"택배 선불", "deliveryPrice": 1000, "addOtherProduct": true, "directLoc": "홍대입구역 2번 출구"}',
    description: '배송수단',
  })
  @Prop({ type: JSON })
  deliveryMethod: JSON;

  @ApiProperty({
    example: '1655944393631',
    description: '배송일',
  })
  @Prop()
  @IsNumber()
  deliveryDate: number;

  readonly basicInfoData:{
    _id: string;
    thumbnailList: string;
    sellerName: string;
    productName: string;
    country: boolean;
    purchasedLocation: string;
    deliveryType: string;
    deliveryDate: string
  }

}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('basicInfoData').get(function (this: Product){
  return {
    _id: this._id,
    thumbnailList: this.thumbnailList,
    sellerName: this.sellerName,
    productName: this.productName,
    country: this.country,
    purchasedLocation: this.purchasedLocation,
    deliveryType: this.deliveryType,
    deliveryDate: this.deliveryDate
  }
})