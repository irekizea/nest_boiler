framework : nestjs
DB : mongodb(mongoose)

validation module : ValidationPipe 사용하여 request 별 dto 분리 및 해당 dto 속성에 맞는 데이터만을 전달 받을 수 있도록 설계


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

4. 셀러 상품 수정

5. 셀러 상품 삭제

6. 마켓 상품 리스트 조회

7. 상품 상세 조회



