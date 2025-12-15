# egojeogo 이거저거 만드는 공간 
*해당 사이트는 다양한 오픈 API 및 만들어 보고싶은 기능들을 만들어 배포하는 사이트입니다.*
- 서울시 열린데이터 광장 실시간 교통 정보 API
  - 관심역을 설정하여 해당 역을 기준으로 실시간 도착정보 제공
  - 출구에 따른 빠른 환승위치 조회
 
- 기상청 오늘의 날씨 서비스 API
  - 비 혹은 눈이 오는 날 우산 챙기기 알림서비스 (Slack 연동) 
  - 알림시간을 사용자가 직접 설정

- 일본어 공부
  - 단어 무작위 선정하여 단어 맞추기 게임
  - AI를 이용하여 간단한 문장 및 구문으로 공부하기
 
<hr>
* 클린 아키텍처 중심 설계

```
├─.gradle
│  ├─9.2.1
│  │  ├─checksums
│  │  ├─executionHistory
│  │  ├─expanded
│  │  ├─fileChanges
│  │  ├─fileHashes
│  │  └─vcsMetadata
│  ├─buildOutputCleanup
│  └─vcs-1
├─.vscode
├─bin
│  ├─default
│  ├─generated-sources
│  │  └─annotations
│  ├─generated-test-sources
│  │  └─annotations
│  ├─main
│  │  ├─com
│  │  │  └─egojeogo
│  │  │      ├─config
│  │  │      ├─controller
│  │  │      └─subway
│  │  │          ├─adapter
│  │  │          │  ├─in
│  │  │          │  │  └─web
│  │  │          │  │      └─dto
│  │  │          │  │          ├─request
│  │  │          │  │          └─response
│  │  │          │  └─out
│  │  │          │      └─repository
│  │  │          ├─application
│  │  │          │  ├─port
│  │  │          │  │  ├─in
│  │  │          │  │  └─out
│  │  │          │  └─service
│  │  │          ├─domain
│  │  │          │  └─model
│  │  │          ├─enums
│  │  │          └─service
│  │  └─templates
│  └─test
│      └─com
│          └─egojeogo
│              └─backend
├─build
│  ├─classes
│  │  └─java
│  │      └─main
│  │          └─com
│  │              └─egojeogo
│  │                  ├─config
│  │                  └─subway
│  │                      ├─adapter
│  │                      │  ├─in
│  │                      │  │  └─web
│  │                      │  │      └─dto
│  │                      │  │          ├─request
│  │                      │  │          └─response
│  │                      │  └─out
│  │                      ├─application
│  │                      │  ├─port
│  │                      │  │  └─in
│  │                      │  └─service
│  │                      ├─domain
│  │                      │  └─model
│  │                      └─enums
│  ├─generated
│  │  └─sources
│  │      ├─annotationProcessor
│  │      │  └─java
│  │      │      └─main
│  │      └─headers
│  │          └─java
│  │              └─main
│  ├─reports
│  │  └─problems
│  ├─resources
│  │  └─main
│  │      ├─static
│  │      └─templates
│  └─tmp
│      └─compileJava
│          └─compileTransaction
│              ├─backup-dir
│              └─stash-dir
├─gradle
│  └─wrapper
└─src
    ├─main
    │  ├─java
    │  │  └─com
    │  │      └─egojeogo
    │  │          ├─config
    │  │          ├─controller
    │  │          └─subway
    │  │              ├─adapter
    │  │              │  ├─in
    │  │              │  │  └─web
    │  │              │  │      └─dto
    │  │              │  │          ├─request
    │  │              │  │          └─response
    │  │              │  └─out
    │  │              │      └─repository
    │  │              ├─application
    │  │              │  ├─port
    │  │              │  │  ├─in
    │  │              │  │  └─out
    │  │              │  └─service
    │  │              ├─domain
    │  │              │  └─model
    │  │              ├─enums
    │  │              └─service
    │  └─resources
    │      ├─static
    │      └─templates
    └─test
        └─java
            └─com
                └─egojeogo
                    └─backend```
