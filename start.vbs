Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\계유미\Thinking pat"
WshShell.Run "cmd /c npm start", 0, False
