import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('이미 있는 유저 이메일일 경우 잘못된 요청 에러 발생', () => {
    it('/user/emailCheck (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/emailCheck')
        .send({
          userEmail: 'test@test.com',
        });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('없는 사용자일 경우 정상 응답 리턴', () => {
    it('/user/emailCheck (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/emailCheck')
        .send({
          userEmail: 'testNew@test.com',
        });
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('사용 가능한 이메일 입니다');
    });
  });

  describe('회원 가입 이미 등록된 이메일일 경우 잘못된 요청 응답 ', () => {
    it('/user/signUp (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/user/signUp').send({
        userEmail: 'test@test.com',
        password: 'asdasd123',
        name: 'testUser',
        countryCode: 82,
        socialType: 'home',
        socialKey: 'home',
        smsAllow: true,
        emailAllow: true,
      });
      expect(res.statusCode).toBe(500);
    });
  });

  describe('회원 가입 ', () => {
    it('/user/signUp (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/user/signUp').send({
        userEmail: 'testNew@test.com',
        password: 'asdasd123',
        name: 'testUser',
        countryCode: 82,
        socialType: 'home',
        socialKey: 'home',
        smsAllow: true,
        emailAllow: true,
      });
      expect(res.statusCode).toBe(201);
      expect(res.text).toBe(
        '{"userEmail":"testNew@test.com","name":"testUser"}',
      );
    });
  });

  const tokenInfo = {};
  describe('로그인 ', () => {
    it('/user/login (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/user/login').send({
        userEmail: 'testNew@test.com',
        password: 'asdasd123',
      });
      expect(res.statusCode).toBe(201);

      const result = JSON.parse(res.text);
      //회원 기본 정보 정의되어 있어야 함
      expect(result['userBasicInfo']).toBeDefined();
      // 회원 비밀번호는 노출되지 않아야 함
      expect(result['userBasicInfo']['password']).toBeUndefined();
      // accesstoken, refresh token 정의 되어야 함
      expect(result['accessToken']).toBeDefined();
      expect(result['refreshToken']).toBeDefined();
      tokenInfo['accessToken'] = result['accessToken'];
      tokenInfo['refreshToken'] = result['refreshToken'];
    });
  });

  describe('셀러 등록 토큰으로 인증 받은 사용자와 등록하려 하는 셀러가 다를 경우 권한 오류 발생', () => {
    it('/user/registSeller (PUT)', async () => {
      const res = await request(app.getHttpServer())
        .put('/user/registSeller')
        .set({ Authorization: 'Bearer ' + tokenInfo['accessToken'] })
        .send({
          userEmail: 'testNew2@test.com',
          sellerName: '유럽셀러',
          bank: '신한은행',
          accountNumber: '235234234234',
          anotherContactNum: '232356234234',
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('셀러 등록 ', () => {
    it('/user/registSeller (PUT)', async () => {
      const res = await request(app.getHttpServer())
        .put('/user/registSeller')
        .set({ Authorization: 'Bearer ' + tokenInfo['accessToken'] })
        .send({
          userEmail: 'testNew@test.com',
          sellerName: '미쿡셀러',
          bank: '신한은행',
          accountNumber: '235234234234',
          anotherContactNum: '232356234234',
        });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('인증되어 있지 않은 다른 셀러 정보 확인하러 할경우 권한 오류 발생 ', () => {
    it('/user/getSellerInfo (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/getSellerInfo')
        .set({ Authorization: 'Bearer ' + tokenInfo['accessToken'] })
        .send({
          userEmail: 'testNew2@test.com',
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('셀러 본인 정보 확인 ', () => {
    it('/user/getSellerInfo (Get)', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/getSellerInfo')
        .set({ Authorization: 'Bearer ' + tokenInfo['accessToken'] })
        .send({
          userEmail: 'testNew@test.com',
        });
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe(
        '{"sellerName":"미쿡셀러","bank":"신한은행","accountNumber":"235234234234","anotherContactNum":"232356234234"}',
      );
    });
  });

  // expired access token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0TmV3QHRlc3QuY29tIiwiaWF0IjoxNjU2MDU3ODk0LCJleHAiOjE2NTYwNTkwOTR9.wOCau3QG9C5ahSVdx60S7H19eGMbDsvHTnqKFFgvN_o

  describe('마켓 리스트 확인', () => {
    it('/product/getMarketList (GET)', async () => {
      const res = await request(app.getHttpServer()).get(
        '/product/getMarketList',
      );
      expect(res.statusCode).toBe(200);
    });
  });

  describe('인증 사용자와 등록하려는 사용자가 다를경우 권한 오류 발생 ', () => {
    it('/product/registProduct (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/product/registProduct')
        .set({ Authorization: 'Bearer ' + tokenInfo['accessToken'] })
        .send({
          userEmail: 'testNew2@test.com',
          productName: '제니쿠키 대형123',
          sellerName: '미쿡셀러',
          thumbnailList: '[3123.jpg, 5235235.jpg, 1112312.jpg]',
          category: '스낵/음료/시럽',
          categoryDetail: '과자/스낵바',
          country: '홍콩',
          optionType: 'singleOption',
          optionList:
            "[{'optionName':'사이즈', 'optionValue':'M', 'optionQuantity':10}]",
          price: 18000,
          productDescription: '홍콩에서 판매되는 이 쿠키는 ...',
          productWarning: '유통기한 확인해 주시고..',
          purchasedDate: 1655944293631,
          purchasedLocation: '홍콩',
          lastOrderDate: 1655944493631,
          deliveryType: "['inner', 'direct']",
          deliveryMethod:
            "{'deliveryOption':'택배 선불', 'deliveryPrice': 1000, 'addOtherProduct': true, 'directLoc': '홍대입구역 2번 출구'}",
          deliveryDate: 1655944693631,
        });
      expect(res.statusCode).toBe(401);
      // expect(res.text).toBe('{"sellerName":"유럽셀러","bank":"신한은행","accountNumber":"235234234234","anotherContactNum":"232356234234"}')
    });
  });

  describe('상품 등록 ', () => {
    it('/product/registProduct (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/product/registProduct')
        .set({ Authorization: 'Bearer ' + tokenInfo['accessToken'] })
        .send({
          userEmail: 'testNew@test.com',
          productName: '제니쿠키 대형123',
          sellerName: '미쿡셀러',
          thumbnailList: '[3123.jpg, 5235235.jpg, 1112312.jpg]',
          category: '스낵/음료/시럽',
          categoryDetail: '과자/스낵바',
          country: '홍콩',
          optionType: 'singleOption',
          optionList:
            "[{'optionName':'사이즈', 'optionValue':'M', 'optionQuantity':10}]",
          price: 18000,
          productDescription: '홍콩에서 판매되는 이 쿠키는 ...',
          productWarning: '유통기한 확인해 주시고..',
          purchasedDate: 1655944293631,
          purchasedLocation: '홍콩',
          lastOrderDate: 1655944493631,
          deliveryType: "['inner', 'direct']",
          deliveryMethod:
            "{'deliveryOption':'택배 선불', 'deliveryPrice': 1000, 'addOtherProduct': true, 'directLoc': '홍대입구역 2번 출구'}",
          deliveryDate: 1655944693631,
        });
      const productInfo = JSON.parse(res.text);
      console.log(res.text);
      expect(res.statusCode).toBe(201);
      expect(productInfo['_id']).toBeDefined();
      tokenInfo['_id'] = productInfo['_id'];
    });
  });

  describe('상품 상세 조회', () => {
    it('/product/getProductDetail (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/product/getProductDetail')
        .send({
          _id: tokenInfo['_id'],
        });
      const productInfo = JSON.parse(res.text);
      expect(res.statusCode).toBe(200);
      expect(productInfo['_id']).toBe(tokenInfo['_id']);
      expect(productInfo['productName']).toBe('제니쿠키 대형123');
      expect(productInfo['sellerName']).toBe('미쿡셀러');
    });
  });

  describe('상품 수정 권한 없을 시 불가', () => {
    it('/product/productUpdate (PUT)', async () => {
      const res = await request(app.getHttpServer())
        .put('/product/productUpdate')
        .send({
          _id: tokenInfo['_id'],
          userEmail: 'testNew@test.com',
          productName: '제니쿠키 소형',
          sellerName: '미쿡셀러',
          thumbnailList: '[3123.jpg, 5235235.jpg, 1112312.jpg]',
          category: '스낵/음료/시럽',
          categoryDetail: '과자/스낵바',
          country: '홍콩',
          optionType: 'singleOption',
          optionList:
            "[{'optionName':'사이즈', 'optionValue':'M', 'optionQuantity':10}]",
          price: 18000,
          productDescription: '홍콩에서 판매되는 이 쿠키는 ...',
          productWarning: '유통기한 확인해 주시고..',
          purchasedDate: 1655944293631,
          purchasedLocation: '홍콩',
          lastOrderDate: 1655944493631,
          deliveryType: "['inner', 'direct']",
          deliveryMethod:
            "{'deliveryOption':'택배 선불', 'deliveryPrice': 1000, 'addOtherProduct': true, 'directLoc': '홍대입구역 2번 출구'}",
          deliveryDate: 1655944693631,
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('상품 수정 ', () => {
    it('/product/productUpdate (PUT)', async () => {
      const res = await request(app.getHttpServer())
        .put('/product/productUpdate')
        .set({ Authorization: 'Bearer ' + tokenInfo['accessToken'] })
        .send({
          _id: tokenInfo['_id'],
          userEmail: 'testNew@test.com',
          productName: '제니쿠키 소형',
          sellerName: '미쿡셀러',
          thumbnailList: '[3123.jpg, 5235235.jpg, 1112312.jpg]',
          category: '스낵/음료/시럽',
          categoryDetail: '과자/스낵바',
          country: '홍콩',
          optionType: 'singleOption',
          optionList:
            "[{'optionName':'사이즈', 'optionValue':'M', 'optionQuantity':10}]",
          price: 18000,
          productDescription: '홍콩에서 판매되는 이 쿠키는 ...',
          productWarning: '유통기한 확인해 주시고..',
          purchasedDate: 1655944293631,
          purchasedLocation: '홍콩',
          lastOrderDate: 1655944493631,
          deliveryType: "['inner', 'direct']",
          deliveryMethod:
            "{'deliveryOption':'택배 선불', 'deliveryPrice': 1000, 'addOtherProduct': true, 'directLoc': '홍대입구역 2번 출구'}",
          deliveryDate: 1655944693631,
        });

      expect(res.statusCode).toBe(200);
    });
  });

  describe('상품 수정 확인', () => {
    it('/product/getProductDetail (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/product/getProductDetail')
        .send({
          _id: tokenInfo['_id'],
        });
      const productInfo = JSON.parse(res.text);
      expect(res.statusCode).toBe(200);
      expect(productInfo['_id']).toBe(tokenInfo['_id']);
      expect(productInfo['productName']).toBe('제니쿠키 소형');
    });
  });

  describe('상품 삭제 권한 없을시', () => {
    it('/product/deleteProduct (DELETE)', async () => {
      const res = await request(app.getHttpServer())
        .delete('/product/deleteProduct')
        .send({
          _id: tokenInfo['_id'],
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('테스트 상품 삭제', () => {
    it('/product/deleteProduct (DELETE)', async () => {
      const res = await request(app.getHttpServer())
        .delete('/product/deleteProduct')
        .set({ Authorization: 'Bearer ' + tokenInfo['accessToken'] })
        .send({
          _id: tokenInfo['_id'],
        });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('상품 삭제 확인', () => {
    it('/product/getProductDetail (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/product/getProductDetail')
        .send({
          _id: tokenInfo['_id'],
        });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('테스트 유저 삭제', () => {
    it('/user/deleteUser (DELETE)', async () => {
      const res = await request(app.getHttpServer())
        .delete('/user/deleteUser')
        .set({ Authorization: 'Bearer ' + tokenInfo['accessToken'] })
        .send({
          userEmail: 'testNew@test.com',
        });
      expect(res.statusCode).toBe(200);
    });
  });
});
