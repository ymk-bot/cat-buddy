# Cat Buddy 🐱

Claude Code가 작업 중일 때 고양이가 화면에 나타나는 데스크탑 앱입니다.

## 상태

| 상태 | 설명 |
|------|------|
| **Working** | Claude가 응답 중일 때 — 화면 중앙에 크게 표시 |
| **Sleeping** | Claude가 대기 중일 때 — 우측 하단에 작게 표시 |
| **Questioning** | 답변이 필요할 때 — 수동으로 키보드 `3` |

## 요구사항

- [Node.js](https://nodejs.org) 18 이상
- [Claude Code](https://claude.ai/code) CLI

## 설치

```bash
git clone https://github.com/<your-username>/cat-buddy.git
cd cat-buddy
npm install
```

## 동영상 준비

`videos` 폴더를 만들고 아래 구조로 동영상을 넣어주세요.  
각 폴더에 여러 개 넣으면 랜덤으로 재생됩니다.

```
videos/
├── working/       ← Claude 작업 중 재생 (mp4, webm, mov)
├── sleeping/      ← 대기 중 재생
└── questioning/   ← 답변 필요 시 재생
```

## Claude Code 훅 설정

`~/.claude/settings.json` 에 아래 내용을 추가하세요.  
파일이 없으면 새로 만들면 됩니다.

```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": "curl.exe -s -m 1 -X POST http://localhost:3333/working || exit 0",
        "async": true
      }]
    }],
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "curl.exe -s -m 1 -X POST http://localhost:3333/sleeping || exit 0",
        "async": true
      }]
    }]
  }
}
```

설정 후 Claude Code를 재시작하거나 `/hooks` 를 열어주세요.

## 실행

```bash
npm start
```

## 키보드 단축키

| 키 | 동작 |
|----|------|
| `1` | Working 상태로 전환 |
| `2` | Sleeping 상태로 전환 |
| `3` | Questioning 상태로 전환 |
| `ESC` | 앱 종료 |
