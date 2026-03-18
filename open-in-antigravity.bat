@echo off
setlocal

set "AG_CMD=C:\Users\Admin\AppData\Local\Programs\Antigravity\bin\antigravity.cmd"

if not exist "%AG_CMD%" (
  echo Antigravity CLI not found at:
  echo %AG_CMD%
  exit /b 1
)

if "%~1"=="" (
  echo Usage:
  echo   open-in-antigravity.bat ^<file-or-folder^> [more paths...]
  exit /b 1
)

call "%AG_CMD%" -r %*

endlocal
