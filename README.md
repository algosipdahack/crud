**Node.js로 CRUD 구현 실습**
--
### <api 문서화>
https://app.swaggerhub.com/apis-docs/algosipdahack/API_Example/1.0.0
--

### 수행 작업
1. docker로 배포 환경 구축 (docker-compose로 db서버, 
app 서버 연동하도록 제작)
2. jwt 적용해서 회원별 권한 관리하기
4. comment 삭제 및 삭제된 유저의 comment 처리
5. comment(댓글)의 대댓글 만들기
6. 로그아웃, 회원탈퇴 api
7. 소셜 로그인 api
8. 일반/관리자 권한 추가해서 
관리자는 모든 댓글 수정, 삭제 가능하도록하기 (가입할때 관리자 체크) + 관리자는 모든 객체에 대해 CRUD 가능해야함
9. 관리자가 일반 유저를 관리자로 올릴 수 있게끔
10. 로깅 api (API별로 user와 요청 내용 정리해서 파일로 로깅하기)
11. 파일 업로드 (이미지 파일, 동영상 파일) -> 그 외의 파일은 업로드 안되게끔/ mime type 확인 작업
12. 파일 다운로드 api
13. nginx로 8081포트에서 8080이랑 같은 서비스 제공
14. docker로 nginx까지 감싸주기
