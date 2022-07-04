framework : nestjs
DB : mongodb(mongoose)

validation module : ValidationPipe 사용하여 request 별 dto 분리 및 해당 dto 속성에 맞는 데이터만을 전달 받을 수 있도록 설계
logger : winston 특정 주요 요청 사항 info 로 알림, 비정상적인 요청일 경우 error 로그 발생


프로젝트 시작 명령어 :   일반 yarn start
                        개발 yarn run start:dev
                        테스트 yarn run test:e2e

운영 파일 .env 


1. 회원
croket 기본 가입 정보 및 필요 정보 수집 하여 schema작성
회원 가입, 로그인 프로세스를 진행하기 위한 dto 작성
1) 일반적인 회원가입 기능 구현
useremail 중복 방지
2) accesstoken 및 refreshtoken을 활용한 로그인 구현
로그인시 accesstoken 발급 refreshtoken이 없을 시(신규가입자) refreshtoken 발급

2. 셀러 입점 정보 등록
1) 셀러 dto 추가 생성하여 셀러 등록에 필요한 정보를 통한 셀러 등록

3. 셀러 상품 등록
1) 셀러 정보 및 해당 상품 등록

4. 셀러 상품 수정
1) 상품 id 바탕 상품 수정

5. 셀러 상품 삭제
1) 상품 id 기반 아이디 삭제

6. 마켓 상품 리스트 조회
1) 상품 검색 옵션 이름, 카테고리, 세부 카테고리 국가 설정
2) 순서 최신, 나중 순 검색 가능
3) 마감 임박 기능 구현


7. 상품 상세 조회
1) 상품 id 바탕 세부 정보 조회 가능

8. test case
swagger 바탕 테스트 가능
http://[운영아이피]:4001/docs/
SWAGGER_USER = croket
SWAGGER_PASSWORD = cro_pwd

swagger api 문서 바탕 execute 함으로서 테스트 가능
guard 가 걸려 있는 api의 경우 accesstoken을 발급 받고 해당 토큰을 해더 Authorization : Bearer [accesstoken]을 넣어서 같이 요청
accesstoken 만료시 로그인 할때 받은 refreshtoken을 같이 accesstoken 갱신에 넣어서 보낼 경우 accesstoken 재발급 가능