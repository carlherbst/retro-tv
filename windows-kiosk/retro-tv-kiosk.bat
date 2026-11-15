@echo off
rem Retro TV kiosk for Windows: opens the guide viewer full screen in Edge
rem (or Chrome), with sound allowed to start without a click.
rem
rem It runs in its own browser profile, so your normal Edge/Chrome windows,
rem tabs and sign-ins are untouched and can stay open alongside it.
rem Quit the kiosk with Alt+F4.
rem
rem Settings (edit here, or set them in the environment before running):
rem   RTV_URL      the viewer address
rem   RTV_BROWSER  edge or chrome
rem   RTV_POS      top-left corner of the screen to open on, "x,y" in desktop
rem                pixels. 0,0 is the main display. If the TV is a second
rem                display to the right of a 2560-wide monitor, use 2560,0.
rem                Settings > System > Display shows the arrangement.

setlocal
if not defined RTV_URL set "RTV_URL=https://retro-tv.projectorion.net/"
if not defined RTV_BROWSER set "RTV_BROWSER=edge"
if not defined RTV_POS set "RTV_POS=0,0"

set "PROFILE=%LOCALAPPDATA%\RetroTV-Kiosk\%RTV_BROWSER%"

if /i "%RTV_BROWSER%"=="chrome" goto chrome

set "EXE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EXE%" set "EXE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EXE%" goto missing
start "" "%EXE%" --user-data-dir="%PROFILE%" --kiosk "%RTV_URL%" --edge-kiosk-type=fullscreen ^
  --window-position=%RTV_POS% --autoplay-policy=no-user-gesture-required ^
  --no-first-run --no-default-browser-check --disable-features=msEdgeSidebarV2
goto end

:chrome
set "EXE=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%EXE%" set "EXE=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if not exist "%EXE%" goto missing
start "" "%EXE%" --user-data-dir="%PROFILE%" --kiosk "%RTV_URL%" ^
  --window-position=%RTV_POS% --autoplay-policy=no-user-gesture-required ^
  --no-first-run --no-default-browser-check
goto end

:missing
echo Could not find %RTV_BROWSER% on this PC. Set RTV_BROWSER to edge or chrome.
pause

:end
endlocal
