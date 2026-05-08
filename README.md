# Cat Buddy 🐱

Claude Code가 작업할 때 고양이가 화면에 나타나는 데스크탑 앱입니다.

**[⬇ 최신 버전 다운로드](https://github.com/ymk-bot/cat-buddy/releases/latest)**

| 상태 | 모습 | 조건 |
|------|------|------|
| **Working** | 화면 중앙에 크게 | Claude가 응답 중 |
| **Sleeping** | 우측 하단에 작게 | Claude 대기 중 |
| **Questioning** | 우측 하단, 물음표 | 권한 요청 시 |

---

## 설치 방법

### 방법 1 — 포터블 버전 (권장)

1. [Releases](../../releases/latest) 에서 `Cat.Buddy.win32.x64.zip` 다운로드
2. 원하는 폴더에 압축 해제
3. `Cat Buddy.exe` 실행

### 방법 2 — 직접 실행 (Node.js 필요)

```bash
git clone https://github.com/계유미/cat-buddy.git
cd cat-buddy
npm install
npm start
```

---

## 동영상 준비

앱 폴더 안에 `videos` 폴더를 만들고 아래 구조로 동영상을 넣어주세요.  
각 폴더에 여러 개 넣으면 랜덤 재생됩니다. (mp4, webm, mov 지원)

```
videos/
├── working/       ← Claude 작업 중 재생
├── sleeping/      ← 대기 중 재생
└── questioning/   ← 권한 요청 시 재생
```

- 포터블 버전이라면: 압축 해제한 폴더 안에 `videos\`
- 직접 실행이라면: 클론한 폴더 안에 `videos\`

---

## 어떤 환경에서 작동하나요?

Cat Buddy는 **Claude Code(공식 CLI)** 의 훅 시스템을 통해 동작합니다.

| 환경 | 작동 여부 |
|------|-----------|
| Claude Code CLI (터미널) | ✅ |
| VS Code + Claude Code 확장 | ✅ |
| Cursor + Claude Code 확장 | ✅ |
| JetBrains + Claude Code 확장 | ✅ |
| Claude.ai 웹사이트 | ❌ |
| Cursor 네이티브 Claude 통합 | ❌ |
| Antigravity / 기타 AI 도구 | ❌ |

**핵심 조건:** Claude Code(Anthropic 공식 CLI, `claude` 명령어)가 실행 중이어야 합니다.  
어떤 IDE나 터미널에서 Claude Code를 쓰든 `~/.claude/settings.json` 훅을 전역으로 읽기 때문에 동일하게 작동합니다.

---

## Claude Code 훅 설정

Claude Code와 연동하려면 `~/.claude/settings.json` 파일에 아래 내용을 추가하세요.

파일이 없으면 새로 만들면 됩니다.

```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{"type": "command", "command": "curl.exe -s -m 1 -X POST http://localhost:3333/working || exit 0"}]
    }],
    "PreToolUse": [{
      "hooks": [{"type": "command", "command": "curl.exe -s -m 1 -X POST http://localhost:3333/working || exit 0"}]
    }],
    "PostToolUse": [{
      "hooks": [{"type": "command", "command": "curl.exe -s -m 1 -X POST http://localhost:3333/working || exit 0"}]
    }],
    "Stop": [{
      "hooks": [{"type": "command", "command": "curl.exe -s -m 1 -X POST http://localhost:3333/sleeping || exit 0"}]
    }],
    "PermissionRequest": [{
      "hooks": [{"type": "command", "command": "curl.exe -s -m 1 -X POST http://localhost:3333/questioning || exit 0"}]
    }]
  }
}
```

이미 `settings.json`이 있다면 `"hooks"` 부분만 기존 내용에 합쳐주세요.

설정 후 Claude Code를 재시작하거나 `/hooks` 를 열어주세요.

---

## 키보드 단축키

앱 창이 포커스된 상태에서 사용 가능합니다.

| 키 | 동작 |
|----|------|
| `ESC` | 앱 종료 |
