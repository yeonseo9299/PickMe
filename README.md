# 결정장애 탈출기 (PickMe)

일상생활에서 선택하기 어려운 사용자를 위한 랜덤 선택 도우미 서비스입니다.

## Tech Stack

- Next.js 16.3.4 (App Router)
- React 19
- TypeScript
- MongoDB
- MongoDB Node.js Driver 7.x
- CSS

## MVP 기능

- 선택지 등록
- 선택지 목록 조회
- 선택지 수정 / 삭제
- 랜덤 결정
- 결정 결과 저장

## 프로젝트 구조

```text
PickMe/
├─ app/
│  ├─ api/
│  │  ├─ choices/
│  │  │  ├─ route.ts
│  │  │  └─ [choiceId]/route.ts
│  │  └─ decisions/route.ts
│  ├─ choices/
│  │  ├─ page.tsx
│  │  └─ register/page.tsx
│  ├─ decision/page.tsx
│  ├─ page.tsx
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  └─ ChoiceForm.tsx
├─ lib/
│  └─ mongodb.ts
├─ types/
│  └─ choice.ts
├─ .env.example
├─ next.config.ts
├─ package.json
└─ README.md
```

## MongoDB Collections

### choices

```text
userId: string
name: string
category: string
createdAt: Date
```

### decisionHistory

```text
userId: string
choiceId: ObjectId
result: string
decisionAt: Date
```

## API

| 기능 | Method | URL |
|---|---|---|
| 선택지 목록 조회 | GET | `/api/choices?userId=...` |
| 선택지 등록 | POST | `/api/choices` |
| 선택지 수정 | PATCH | `/api/choices/:choiceId` |
| 선택지 삭제 | DELETE | `/api/choices/:choiceId?userId=...` |
| 랜덤 결정 | POST | `/api/decisions` |

## 설치

```bash
npm install
```

## 환경 변수

`.env.example`을 `.env.local`로 복사하고 MongoDB 연결 정보를 입력합니다.

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=pickme
```

## 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 개발 순서

1. MongoDB 연결
2. 선택지 CRUD 완성
3. 랜덤 결정 및 결정 기록 완성
4. 사용자 인증 연결
5. 카테고리 / 즐겨찾기 / 기록 화면 등 추가 기능 구현

> 현재 코드는 MVP 개발을 시작할 수 있는 기본 골격입니다. 인증은 이후 실제 로그인 기능과 연결하도록 `demo-user`로 임시 처리되어 있습니다.

## MongoDB 연결 설정

1. MongoDB Atlas에서 사용할 클러스터를 준비합니다.
2. 프로젝트 루트의 `.env.local.example`을 복사하여 `.env.local`을 만듭니다.
3. `.env.local`의 `MONGODB_URI`에 MongoDB Atlas Connection String을 입력합니다.
4. `MONGODB_DB`는 `pickme`로 사용합니다.
5. 개발 서버를 실행합니다.

```bash
npm install
npm run dev
```

MongoDB 연결 확인:

```text
http://localhost:3000/api/health
```

정상 연결되면 `connected: true`가 반환됩니다.

> `.env.local`은 비밀번호가 포함될 수 있으므로 Git에 올리거나 다른 사람에게 공유하지 않습니다.

## MongoDB 연결 확인

개발 서버 실행 후 `http://localhost:3000/api/health`를 열어 MongoDB 연결 상태를 확인합니다.

- `connected: true` → MongoDB 연결 정상
- `connected: false` → `.env.local`, MongoDB Atlas Network Access, DB 사용자/비밀번호, Connection String을 확인합니다.
