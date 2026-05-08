const { app, BrowserWindow, ipcMain, screen } = require('electron')
const http = require('http')

let win
let lastCenterX = null
let lastCenterY = null
let lastSmallX = null
let lastSmallY = null
let currentState = 'working'

const STATES = {
  working:     { width: 520, height: 520 },
  sleeping:    { width: 195, height: 240 },
  questioning: { width: 195, height: 275 },
}

function setWorking() {
  if (!win) return
  currentState = 'working'
  const { width, height } = STATES.working
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize
  const cx = lastCenterX ?? Math.floor(sw / 2)
  const cy = lastCenterY ?? Math.floor(sh / 2)
  win.setResizable(true)
  win.setBounds({
    x: Math.floor(cx - width / 2),
    y: Math.floor(cy - height / 2),
    width,
    height,
  })
  win.webContents.send('show-working')
}

function setSleeping() {
  if (!win) return
  currentState = 'sleeping'
  win.setAspectRatio(0)
  const { width, height } = STATES.sleeping
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize
  win.setResizable(false)
  const x = lastSmallX ?? sw - width - 20
  const y = lastSmallY ?? sh - height - 20
  win.setBounds({ x, y, width, height })
  win.webContents.send('show-sleeping')
}

function setQuestioning() {
  if (!win) return
  currentState = 'questioning'
  win.setAspectRatio(0)
  const { width, height } = STATES.questioning
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize
  win.setResizable(false)
  const x = lastSmallX ?? sw - width - 20
  const y = lastSmallY ?? sh - height - 20
  win.setBounds({ x, y, width, height })
  win.webContents.send('show-questioning')
}

function startServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })

    if (req.method === 'POST' && req.url === '/working') {
      setWorking()
      res.end('ok')
    } else if (req.method === 'POST' && req.url === '/sleeping') {
      setSleeping()
      res.end('ok')
    } else if (req.method === 'POST' && req.url === '/questioning') {
      setQuestioning()
      res.end('ok')
    } else {
      res.end('cat-buddy')
    }
  })

  server.listen(3333, '127.0.0.1', () => {
    console.log('Cat Buddy 서버 시작됨: http://localhost:3333')
  })
}

function createWindow() {
  const { width, height } = STATES.working
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize

  win = new BrowserWindow({
    width,
    height,
    x: Math.floor((sw - width) / 2),
    y: Math.floor((sh - height) / 2),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.loadFile('index.html')
  startServer()

  win.on('moved', () => {
    const b = win.getBounds()
    if (currentState === 'working') {
      lastCenterX = b.x + Math.floor(b.width / 2)
      lastCenterY = b.y + Math.floor(b.height / 2)
    } else {
      lastSmallX = b.x
      lastSmallY = b.y
    }
  })

  win.on('resized', () => {
    const b = win.getBounds()
    STATES.working = { width: b.width, height: b.height }
    lastCenterX = b.x + Math.floor(b.width / 2)
    lastCenterY = b.y + Math.floor(b.height / 2)
  })
}

ipcMain.on('state-working', setWorking)
ipcMain.on('state-sleeping', setSleeping)
ipcMain.on('state-questioning', setQuestioning)
ipcMain.on('quit', () => app.quit())

ipcMain.on('video-loaded', (event, { width, height }) => {
  if (!win) return
  const ratio = width / height
  const w = STATES.working.width
  const h = Math.round(w / ratio)
  STATES.working = { width: w, height: h }
  win.setAspectRatio(ratio)
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize
  const cx = lastCenterX ?? Math.floor(sw / 2)
  const cy = lastCenterY ?? Math.floor(sh / 2)
  win.setBounds({
    x: Math.floor(cx - w / 2),
    y: Math.floor(cy - h / 2),
    width: w,
    height: h,
  })
})

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
