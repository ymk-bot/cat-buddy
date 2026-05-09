# Cat Buddy 🐱

A desktop companion app that shows a cat on your screen whenever Claude Code is working.

Cat Buddy sits on top of your screen and reacts to what Claude Code is doing in real time.
When Claude is thinking or using tools, your cat is busy at work. When Claude finishes,
the cat curls up and waits. When Claude needs your permission, the cat bounces a question mark.
It doesn't do anything useful — it just makes the wait a little less lonely.

**[⬇ Download Latest](https://github.com/ymk-bot/cat-buddy/releases/latest)**

---

Claude Code가 작업할 때 고양이가 화면에 나타나는 데스크탑 앱입니다.

Cat Buddy는 화면 위에 올라앉아 Claude Code가 하는 일에 실시간으로 반응합니다.
Claude가 생각하거나 툴을 쓸 때 고양이는 바쁘게 움직이고, 응답이 끝나면 조용히 기다리고,
권한 요청이 오면 물음표를 튕기며 알려줍니다.
딱히 생산적인 건 아닌데, 기다리는 시간이 조금 덜 외로워집니다.

| State | Appearance | Trigger |
|-------|-----------|---------|
| **Working** | Large, center screen | Claude is responding |
| **Sleeping** | Small, bottom-right | Claude is idle |
| **Questioning** | Bottom-right, pulsing | Permission request |

상태 | 모습 | 조건
-----|------|-----
**Working** | 화면 중앙에 크게 | Claude가 응답 중
**Sleeping** | 우측 하단에 작게 | Claude 대기 중
**Questioning** | 우측 하단, 물음표 | 권한 요청 시

---

## Installation / 설치 방법

### Option 1 — Portable (Recommended) / 포터블 버전 (권장)

---

#### 🪟 Windows

> Download **`Cat.Buddy.win32.x64.zip`** from [Releases](https://github.com/ymk-bot/cat-buddy/releases/latest)
>
> [Releases](https://github.com/ymk-bot/cat-buddy/releases/latest) 에서 **`Cat.Buddy.win32.x64.zip`** 다운로드

1. Extract to any folder / 원하는 폴더에 압축 해제
2. Run `Cat Buddy.exe` / `Cat Buddy.exe` 실행

---

#### 🍎 macOS

> Download **`Cat.Buddy.darwin.arm64.zip`** from [Releases](https://github.com/ymk-bot/cat-buddy/releases/latest)
>
> [Releases](https://github.com/ymk-bot/cat-buddy/releases/latest) 에서 **`Cat.Buddy.darwin.arm64.zip`** 다운로드
>
> ⚠️ For Intel Mac, download `Cat.Buddy.darwin.x64.zip` instead. / Intel Mac 사용자는 `Cat.Buddy.darwin.x64.zip` 을 받으세요.

1. Extract to any folder / 원하는 폴더에 압축 해제
2. Run `Cat Buddy.app` / `Cat Buddy.app` 실행

---

### Option 2 — Run from source (Node.js required) / 직접 실행 (Node.js 필요)

**🪟 Windows**
```bash
git clone https://github.com/ymk-bot/cat-buddy.git
cd cat-buddy
npm install
npm start
```

**🍎 macOS**
```bash
git clone https://github.com/ymk-bot/cat-buddy.git
cd cat-buddy
npm install
chmod +x start.sh
./start.sh
```

---

## Videos / 동영상 준비

Create a `videos` folder inside the app directory with this structure.  
Multiple files in each folder will play randomly. (mp4, webm, mov supported)

앱 폴더 안에 `videos` 폴더를 만들고 아래 구조로 동영상을 넣어주세요.  
각 폴더에 여러 개 넣으면 랜덤 재생됩니다. (mp4, webm, mov 지원)

```
videos/
├── working/       ← plays while Claude is working
├── sleeping/      ← plays while idle
└── questioning/   ← plays on permission request
```

- Portable version: place `videos\` inside the extracted folder
- Source version: place `videos\` inside the cloned folder

---

- 포터블 버전이라면: 압축 해제한 폴더 안에 `videos\`
- 직접 실행이라면: 클론한 폴더 안에 `videos\`

---

## Compatibility / 어떤 환경에서 작동하나요?

Cat Buddy works through **Claude Code's hook system** (the official CLI by Anthropic).

Cat Buddy는 **Claude Code(공식 CLI)** 의 훅 시스템을 통해 동작합니다.

| Environment | Works |
|-------------|-------|
| Claude Code CLI (terminal) | ✅ |
| VS Code + Claude Code extension | ✅ |
| Cursor + Claude Code extension | ✅ |
| JetBrains + Claude Code extension | ✅ |
| Claude.ai website | ❌ |
| Cursor native Claude integration | ❌ |
| Antigravity / other AI tools | ❌ |

**Key requirement:** Claude Code (the `claude` CLI command) must be running.  
It reads `~/.claude/settings.json` hooks globally, so it works the same regardless of which IDE you use.

**핵심 조건:** Claude Code(Anthropic 공식 CLI, `claude` 명령어)가 실행 중이어야 합니다.  
어떤 IDE나 터미널에서 Claude Code를 쓰든 `~/.claude/settings.json` 훅을 전역으로 읽기 때문에 동일하게 작동합니다.

---

## Claude Code Hook Setup / Claude Code 훅 설정

Add the following to `~/.claude/settings.json`. Create the file if it doesn't exist.

`~/.claude/settings.json` 파일에 아래 내용을 추가하세요. 파일이 없으면 새로 만들면 됩니다.

**Windows**
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

**macOS**
```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{"type": "command", "command": "curl -s -m 1 -X POST http://localhost:3333/working || exit 0"}]
    }],
    "PreToolUse": [{
      "hooks": [{"type": "command", "command": "curl -s -m 1 -X POST http://localhost:3333/working || exit 0"}]
    }],
    "PostToolUse": [{
      "hooks": [{"type": "command", "command": "curl -s -m 1 -X POST http://localhost:3333/working || exit 0"}]
    }],
    "Stop": [{
      "hooks": [{"type": "command", "command": "curl -s -m 1 -X POST http://localhost:3333/sleeping || exit 0"}]
    }],
    "PermissionRequest": [{
      "hooks": [{"type": "command", "command": "curl -s -m 1 -X POST http://localhost:3333/questioning || exit 0"}]
    }]
  }
}
```

If `settings.json` already exists, merge only the `"hooks"` section into your existing file.

이미 `settings.json`이 있다면 `"hooks"` 부분만 기존 내용에 합쳐주세요.

Restart Claude Code or open `/hooks` after saving.

설정 후 Claude Code를 재시작하거나 `/hooks` 를 열어주세요.

---

## Usage / 사용 방법

### Resizing / 창 크기 조절

The working state window (large, center screen) is freely resizable.
Drag any corner or edge to adjust the size — Cat Buddy remembers it for next time.

Working 상태(화면 중앙 큰 창)는 자유롭게 크기를 조절할 수 있습니다.
모서리나 가장자리를 드래그해서 원하는 크기로 바꾸면 다음번에도 그 크기로 열립니다.

### Moving / 창 위치 이동

All states are draggable — click and drag anywhere on the window to reposition.

모든 상태에서 창을 드래그해 위치를 옮길 수 있습니다.

## Keyboard Shortcuts / 키보드 단축키

| Key | Action |
|-----|--------|
| `ESC` | Quit app / 앱 종료 |

> Tip: Click the cat window first to focus it before pressing ESC.  
> 앱 창을 먼저 클릭해서 포커스한 뒤 ESC를 누르세요.
