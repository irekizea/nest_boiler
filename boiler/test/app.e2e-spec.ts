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
      expect(res.statusCode).toBe(405);
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

  // expired access token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0TmV3QHRlc3QuY29tIiwiaWF0IjoxNjU2MDU3ODk0LCJleHAiOjE2NTYwNTkwOTR9.wOCau3QG9C5ahSVdx60S7H19eGMbDsvHTnqKFFgvN_o

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
