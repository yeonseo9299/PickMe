# 결정장애 탈출기 (PickMe)

일상생활에서 선택하기 어려운 사용자를 위한 랜덤 선택 도우미 서비스입니다.

## 기술 스택
- Next.js 16
- React 19
- TypeScript
- MongoDB
- MongoDB Node.js Driver
- CSS

## 주요 기능
- 회원가입 / 로그인 / 로그아웃
- 로그인 사용자별 선택지 저장 및 관리
- 음식 / 쇼핑 / 여가 / 기타 카테고리별 선택지 관리
- 카테고리별 랜덤 결정
- 로그인 사용자별 결정 기록 저장 및 조회

## 계정별 데이터 분리
사용자가 로그인하면 서버가 HttpOnly 세션 쿠키에서 사용자를 확인합니다.
프론트엔드에서 `userId`를 직접 보내지 않고, 서버가 세션의 사용자 ID를 기준으로 MongoDB를 조회합니다.

따라서 다음 데이터는 계정별로 분리됩니다.

- `choices.userId` → 해당 계정이 등록한 선택지만 조회
- `decisionHistory.userId` → 해당 계정의 결정 기록만 조회

또한 선택지 수정/삭제 시에도 세션 사용자와 데이터의 `userId`가 같은 경우에만 처리됩니다.

## 화면
- `/` : 메인
- `/register` : 회원가입
- `/login` : 로그인
- `/choices/register` : 선택지 등록
- `/choices` : 선택지 관리
- `/decision` : 카테고리별 랜덤 결정
- `/history` : 결정 기록

선택지 관리, 랜덤 결정, 결정 기록 페이지는 로그인하지 않은 사용자가 접근하면 로그인 화면으로 이동합니다.

## 프로젝트 구조
```text
PickMe/
├─ app/
│  ├─ api/
│  │  ├─ auth/
│  │  │  ├─ login/route.ts
│  │  │  ├─ register/route.ts
│  │  │  ├─ logout/route.ts
│  │  │  └─ me/route.ts
│  │  ├─ choices/
│  │  │  ├─ route.ts
│  │  │  └─ [choiceId]/route.ts
│  │  ├─ decisions/route.ts
│  │  ├─ history/route.ts
│  │  └─ health/route.ts
│  ├─ choices/
│  │  ├─ register/page.tsx
│  │  └─ page.tsx
│  ├─ decision/page.tsx
│  ├─ history/page.tsx
│  ├─ login/page.tsx
│  ├─ register/page.tsx
│  ├─ page.tsx
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  ├─ AuthGuard.tsx
│  └─ ChoiceForm.tsx
├─ lib/
│  ├─ auth.ts
│  └─ mongodb.ts
├─ types/choice.ts
├─ .env.local
└─ package.json
```

## MongoDB 설정
MongoDB Compass에서 로컬 MongoDB를 사용하는 경우 기본 연결 주소는 다음과 같습니다.

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=pickme
SESSION_SECRET=길고예측하기어려운문자열
```

`.env.local`을 프로젝트 루트에 만들고 입력합니다.

## 설치 및 실행
```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 회원가입 / 로그인
회원가입 시 `users` 컬렉션에 다음과 같은 정보가 저장됩니다.

```text
_id
name
email
passwordHash
createdAt
```

비밀번호 원문은 저장하지 않고 Node.js `crypto.scrypt`로 해시합니다.
로그인 성공 시 HttpOnly 세션 쿠키가 생성됩니다.

## MongoDB 컬렉션

### users
```text
_id
name
email
passwordHash
createdAt
```

### choices
```text
_id
userId
name
category
createdAt
```

### decisionHistory
```text
_id
userId
choiceId
result
category
decisionAt
```

## 주요 API
| 기능 | Method | URL |
|---|---|---|
| 회원가입 | POST | `/api/auth/register` |
| 로그인 | POST | `/api/auth/login` |
| 로그아웃 | POST | `/api/auth/logout` |
| 현재 로그인 사용자 | GET | `/api/auth/me` |
| 선택지 목록 | GET | `/api/choices` |
| 카테고리별 선택지 목록 | GET | `/api/choices?category=음식` |
| 선택지 등록 | POST | `/api/choices` |
| 선택지 수정 | PATCH | `/api/choices/:choiceId` |
| 선택지 삭제 | DELETE | `/api/choices/:choiceId` |
| 카테고리별 랜덤 결정 | POST | `/api/decisions` |
| 결정 기록 조회 | GET | `/api/history` |
| MongoDB 연결 확인 | GET | `/api/health` |

### 랜덤 결정 Request
```json
{
  "category": "음식"
}
```

## 랜덤 결정 흐름
```text
카테고리 선택
→ 로그인 사용자 확인
→ 해당 사용자의 choices 조회
→ 선택한 카테고리로 필터링
→ 하나를 랜덤 선택
→ decisionHistory 저장
→ 결과 반환
```

## 오류 처리
- 400 : 잘못된 입력
- 401 : 로그인 필요
- 403 : 권한 없음
- 404 : 데이터 없음
- 409 : 중복 회원가입
- 500 : 서버 / DB 오류

## 개발 순서
1. 프로젝트 환경 구성
2. MongoDB 연결
3. 사용자 회원가입 / 로그인 구현
4. 계정별 선택지 CRUD 구현
5. 카테고리별 랜덤 결정 구현
6. 계정별 결정 기록 구현
7. 화면 연결 및 오류 처리
8. 테스트
