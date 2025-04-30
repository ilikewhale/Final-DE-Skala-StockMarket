
# Stockala 📈 
>  실시간 시세 주식 정보와 가상 거래 기능을 제공하는 주식 거래 서비스

## 📋 프로젝트 소개

**Stockala**는 Spring Framework를 활용하여 MVC 패턴을 이해하고 다양한 API를 경험하기 위해 개발된 프로젝트입니다.<br>
실시간으로 업데이트되는 주식 시세 정보를 제공하고, 사용자들이 가상 자산으로 주식을 거래할 수 있는 기능을 제공합니다.

JPA를 통한 데이터베이스 연결과 DTO 구조를 적용하여 체계적인 백엔드 아키텍처를 구현했습니다.

## 🛠️ 기술 스택

### Backend
- **언어**: Java 21
- **프레임워크**: Spring Boot 3.4.4
- **ORM**: Spring Data JPA
- **빌드 도구**: Gradle
- **데이터베이스**: H2 Database

### Frontend
- **프레임워크**: Vue.js 3
- **상태 관리**: Pinia
- **라우팅**: Vue Router 4
- **HTTP 통신**: Axios
- **빌드 도구**: Vite

## ✨ 주요 기능

### 👤 사용자 관리
- 회원가입 및 로그인 기능
<div align="center" style="display: flex; gap: 20px;"> <img src="https://github.com/user-attachments/assets/627a5731-2c67-430a-9b3d-bba65d165703" alt="로그인 화면" width="400"> <img src="https://github.com/user-attachments/assets/6b2c7f63-4877-4c09-a833-4806fe83d888" alt="회원가입 화면" width="400"> </div>

### 📱 대시보드 
사용자의 투자 현황과 자산 정보를 한눈에 확인할 수 있는 메인 페이지입니다.

<div align="center">
  <img src="https://github.com/user-attachments/assets/79167b8c-1e85-4060-82ad-d9bdf4f9eec0" alt="대시보드 스크린샷" width="600">
</div>

**주요 기능:**
- **보유 자산 요약**: 사용자의 총 보유 자산 표시
- **전체 주식 목록**: 현재 시장에 있는 모든 주식의 실시간 가격과 변동률(+1.27%, -1.46% 등) 표시
- **보유 주식 정보**: 사용자가 보유한 주식 목록(Skala, JAVA를 JAVA!, Happy6Team)과 수량, 현재가 표시
- **주식 거래 기능**: 주식 ID와 비밀번호 입력을 통한 매수/매도/취소 기능 제공

### 💸 거래 내역
사용자의 과거 주식 거래 기록을 확인할 수 있는 페이지입니다.
<div align="center">
  <img src="https://github.com/user-attachments/assets/ab9ff198-8339-4a56-8047-1918e6984f5b" alt="거래내역 스크린샷" width="600">
</div>

**주요 기능:**
- **거래 목록 표시**: 날짜, 종목명, 거래 유형(매수/매도), 수량, 단가, 총액 정보 제공
- **상세 거래 정보**: 각 거래별 상세 정보(2025년 4월 30일 오전 8:57 등의 정확한 시간) 표시
- **거래 내역 정렬**: 최신 거래부터 시간순으로 정렬된 거래 내역 제공
- **종목별 거래 확인**: Happy6Team, JAVA를 JAVA!, Skala 등 다양한 종목의 거래 내역 확인 가능

## 🔌 REST API 명세
<details>
<summary>Swagger로 보는 Stockala 서비스 API (클릭하여 펼치기)</summary>

<div align="center">
  <img src="https://github.com/user-attachments/assets/4b722c7b-285a-41e0-baf2-abee8419628f" alt="대시보드 스크린샷" width="600">
</div>
</details>


## 🏗️ 프로젝트 구조

```
stockala/
├── backend/                 # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── stock/ # 메인 패키지
│       │   │   │            ├── config/       # 설정 클래스
│       │   │   │            ├── controller/   # REST API 컨트롤러
│       │   │   │            ├── domain/       # 엔티티 모델
│       │   │   │            ├── dto/          # 데이터 전송 객체
│       │   │   │            ├── repository/   # JPA 리포지토리
│       │   │   │            ├── scheduler/    # 스케줄러 작업
│       │   │   │            ├── service/      # 비즈니스 로직
│       │   │   │            └── StockApplication.java  # 메인 애플리케이션
│       │   │   └── resources/         # 설정 파일
│       │   └── test/                  # 테스트 코드
│   └── build.gradle                   # Gradle 빌드 파일
│
└── frontend/                # Vue.js 프론트엔드
    ├── src/
    │   ├── assets/                    # 정적 자원
    │   ├── components/                # Vue 컴포넌트
    │   ├── store/                     # Pinia 상태 관리
    │   ├── views/                     # 페이지 뷰
    │   ├── router/                    # Vue Router 설정
    │   └── services/                  # API 서비스
    ├── package.json                   # NPM 패키지 설정
    └── vite.config.js                 # Vite 설정
```

## 🚀 설치 및 실행 방법


### 백엔드 실행
```bash
# 프로젝트 클론
git clone https://github.com/yourusername/stockala.git
cd stockala/backend

# Gradle로 프로젝트 실행
./gradlew bootRun
```

### 프론트엔드 실행
```bash
# 프론트엔드 디렉토리로 이동
cd ../frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 📝 학습 목표

본 프로젝트를 통해 다음과 같은 기술적 이해와 경험을 얻고자 했습니다:

- Spring Framework의 MVC 패턴 이해와 적용
- RESTful API 설계 및 구현
- JPA를 활용한 데이터베이스 연동
- Vue.js를 이용한 SPA(Single Page Application) 개발
- 프론트엔드와 백엔드 간의 효율적인 통신 구현
