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

  describe('hello jest', () => {
    it('two plus two is four', () => {
      expect(2 + 2).toBe(4)
    })
  })

  describe('이미 있는 유저 이메일일 경우 잘못된 요청 에러 발생', () => {
    it('/user/emailCheck (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/user/emailCheck').send({
        userEmail: 'test@test.com'
      })
      expect(res.statusCode).toBe(400);
    })
  })

  // describe('없는 사용자일 경우 정상 응답 리턴', () => {
  //   it('/user/emailCheck (POST)', async () => {
  //     const res = await request(app.getHttpServer()).post('/user/emailCheck').send({
  //       userEmail: 'testNew@test.com'
  //     })
  //     expect(res.statusCode).toBe(201);
  //     expect(res.text).toBe('사용 가능한 이메일 입니다');
  //   })
  // })

  // describe('회원 가입 이미 등록된 이메일일 경우 잘못된 요청 응답 ', () => {
  //   it('/user/signUp (POST)', async () => {
  //     const res = await request(app.getHttpServer()).post('/user/signUp').send({
  //       userEmail: 'test@test.com',
  //       password: "asdasd123",        
  //       name: "testUser",
  //       countryCode: 82,
  //       socialType : "home",
  //       socialKey : "home",
  //       smsAllow : true,
  //       emailAllow : true
  //     })
  //     expect(res.statusCode).toBe(400);
  //   })
  // })

  // describe('회원 가입 ', () => {
  //   it('/user/signUp (POST)', async () => {
  //     const res = await request(app.getHttpServer()).post('/user/signUp').send({
  //       userEmail: 'testNew@test.com',
  //       password: "asdasd123",        
  //       name: "testUser",
  //       countryCode: 82,
  //       socialType : "home",
  //       socialKey : "home",
  //       smsAllow : true,
  //       emailAllow : true
  //     })
  //     expect(res.statusCode).toBe(201);
  //     expect(res.text).toBe('{"userEmail":"testNew@test.com","name":"testUser"}')
  //   })
  // })

  let tokenInfo ={};
  describe('로그인 ', () => {
    it('/user/login (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/user/login').send({
        userEmail: 'testNew@test.com',
        password: "asdasd123",        
      })
      expect(res.statusCode).toBe(201);

      const result =JSON.parse(res.text);
      //회원 기본 정보 정의되어 있어야 함
      expect(result['userBasicInfo']).toBeDefined();
      // 회원 비밀번호는 노출되지 않아야 함
      expect(result['userBasicInfo']['password']).toBeUndefined();
      // accesstoken, refresh token 정의 되어야 함
      expect(result['accessToken']).toBeDefined();
      expect(result['refreshToken']).toBeDefined();
      tokenInfo['accessToken'] =result['accessToken'];
      tokenInfo['refreshToken'] =result['refreshToken'];
    })
  })

  describe('셀러 등록 토큰으로 인증 받은 사용자와 등록하려 하는 셀러가 다를 경우 권한 오류 발생', () => {
    it('/user/registSeller (PUT)', async () => {
      const res = await request(app.getHttpServer()).put('/user/registSeller').
      set({Authorization:'Bearer ' + tokenInfo['accessToken']}).send({
        userEmail: 'testNew2@test.com',
        sellerName: '유럽셀러',
        bank: '신한은행',
        accountNumber: '235234234234',
        anotherContactNum : '232356234234',
      })
      expect(res.statusCode).toBe(401);
    })
  })

  describe('셀러 등록 ', () => {
    it('/user/registSeller (PUT)', async () => {
      const res = await request(app.getHttpServer()).put('/user/registSeller').
      set({Authorization:'Bearer ' + tokenInfo['accessToken']}).send({
        userEmail: 'testNew@test.com',
        sellerName: '유럽셀러',
        bank: '신한은행',
        accountNumber: '235234234234',
        anotherContactNum : '232356234234',
      })
      expect(res.statusCode).toBe(200);
    })
  })

  describe('인증되어 있지 않은 다른 셀러 정보 확인하러 할경우 권한 오류 발생 ', () => {
    it('/user/getSellerInfo (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/user/getSellerInfo').
      set({Authorization:'Bearer ' + tokenInfo['accessToken']}).send({
        userEmail: 'testNew2@test.com',
      })
      expect(res.statusCode).toBe(401);
    })
  })

  describe('셀러 본인 정보 확인 ', () => {
    it('/user/getSellerInfo (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/user/getSellerInfo').
      set({Authorization:'Bearer ' + tokenInfo['accessToken']}).send({
        userEmail: 'testNew@test.com',
      })
      expect(res.statusCode).toBe(201);
      expect(res.text).toBe('{"sellerName":"유럽셀러","bank":"신한은행","accountNumber":"235234234234","anotherContactNum":"232356234234"}')
    })
  })

  //expired access token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0TmV3QHRlc3QuY29tIiwiaWF0IjoxNjU2MDU3ODk0LCJleHAiOjE2NTYwNTkwOTR9.wOCau3QG9C5ahSVdx60S7H19eGMbDsvHTnqKFFgvN_o


});
