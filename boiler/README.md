framework : nestjs
DB : mongodb(mongoose)

언제나 https://docs.nestjs.com/ 참고할것
해당 readme 문서는 nestdocs 바탕으로 생성

프로젝트 시작 명령어 :   일반 yarn start
                        개발 yarn run start:dev
                        테스트 yarn run test:e2e


운영 파일 .env 
해당 리스트 복사 하여 env 에 추가 및 내용 입력
[


SWAGGER_USER=...
SWAGGER_PASSWORD=...
PORT =...
# ex) test
NODE_ENV =...
# ex) dev
process.env.MODE =...
MONGODB_URI=...

#access token key
JWT_SECRET=...
#access token exp
JWT_ACCESS_EXP=...
#refresh token key
JWT_REFRESH_SECRET=...
#refresh token exp
JWT_REFRESH_EXP=...

]

1. 기본 프로젝트 생성 및 cli
1) set up
npm i -g @nestjs/cli
nest new project-name

2) 새 프로젝트 기본 파일들
app.controller.ts	기본 컨트롤러
app.module.ts	어플리 케이션의 루트 모듈
app.service.ts	기본 서비스
main.ts 네스트 어플리 케이션 생성 위한 메인

#spec 파일들은 유닛 테스트를 위한 파일 

3) 모듈 생성 cli
nest g [모듈명] [모듈 이름]
ex) nest g controller cats
#기본 모듈명 리스트
(1) module
(2) controller
(3) service

2. 밸리데이션
1) 기본 벨리데이션 모듈
class-validator 등

3. 로거 관리
1) pre-controller 로거

2) post_request

4. 예외 처리

5. test case
swagger 바탕 테스트 가능
http://[운영아이피]:4001/docs/
SWAGGER_USER = boiler
SWAGGER_PASSWORD = cro_pwd

swagger api 문서 바탕 execute 함으로서 테스트 가능
guard 가 걸려 있는 api의 경우 accesstoken을 발급 받고 해당 토큰을 해더 Authorization : Bearer [accesstoken]을 넣어서 같이 요청
accesstoken 만료시 로그인 할때 받은 refreshtoken을 같이 accesstoken 갱신에 넣어서 보낼 경우 accesstoken 재발급 가능

v 1.0 최초 버전

##. 참고 사항
request lifecycle

Incoming request
Globally bound middleware
Module bound middleware
Global guards
Controller guards
Route guards
Global interceptors (pre-controller)
Controller interceptors (pre-controller)
Route interceptors (pre-controller)
Global pipes
Controller pipes
Route pipes
Route parameter pipes
Controller (method handler)
Service (if exists)
Route interceptor (post-request)
Controller interceptor (post-request)
Global interceptor (post-request)
Exception filters (route, then controller, then global)
Server response