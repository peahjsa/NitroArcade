@echo off
title NitroArcade - Git repair
echo ================================================
echo  NitroArcade Git repair
echo  Your files on the D: drive will NOT be changed.
echo ================================================
echo.

rem --- 1. Find Git (normal install, or the one inside GitHub Desktop)
set "GIT="
where git >nul 2>nul && set "GIT=git"
if not defined GIT (
  for /d %%D in ("%LOCALAPPDATA%\GitHubDesktop\app-*") do (
    if exist "%%D\resources\app\git\cmd\git.exe" set "GIT=%%D\resources\app\git\cmd\git.exe"
  )
)
if not defined GIT (
  echo Could not find Git. Install "Git for Windows" from git-scm.com and run this again.
  pause
  exit /b 1
)

rem --- 2. Find the project folder (the one that contains .git)
set "ROOT=%~dp0"
:findroot
if exist "%ROOT%.git" goto :found
for %%I in ("%ROOT%..") do set "PARENT=%%~fI\"
if /i "%PARENT%"=="%ROOT%" goto :notfound
set "ROOT=%PARENT%"
goto :findroot

:notfound
echo Could not find a .git folder. Put this file inside your NitroArcade project folder and run it again.
pause
exit /b 1

:found
set "ROOTN=%ROOT:~0,-1%"
echo Project folder found: %ROOTN%
echo.

rem --- 3. Read the GitHub address from the old repository settings
set "URL="
"%GIT%" -c safe.directory=* -C "%ROOTN%" config --get remote.origin.url > "%TEMP%\nitro_url.txt" 2>nul
set /p URL=<"%TEMP%\nitro_url.txt"
if not defined URL (
  echo Could not read the GitHub address automatically.
  set /p URL=Paste your GitHub repository address here and press Enter: 
)
echo GitHub address: %URL%
echo.

rem --- 4. Download a fresh, healthy copy onto the C: drive
if not exist "C:\Projects" mkdir "C:\Projects"
set "FRESH=C:\Projects\NitroArcade_fresh"
if exist "%FRESH%" set "FRESH=C:\Projects\NitroArcade_fresh_%RANDOM%"
echo Downloading a fresh copy to %FRESH% ...
"%GIT%" clone "%URL%" "%FRESH%"
if errorlevel 1 (
  echo.
  echo The download failed. Check your internet and GitHub sign-in, then run this again.
  pause
  exit /b 1
)

rem --- 5. Copy your current website files on top (the damaged .git folder is skipped)
echo.
echo Copying your website files. This can take a few minutes...
robocopy "%ROOTN%" "%FRESH%" /E /XD ".git" /R:1 /W:1 /NFL /NDL /NP
if errorlevel 8 (
  echo.
  echo Some files could not be copied. Take a screenshot of this window and send it to me.
  pause
  exit /b 1
)

rem --- 6. Save the changes as a commit in the fresh copy
echo.
echo Saving your changes...
"%GIT%" -c safe.directory=* -C "%FRESH%" add -A
"%GIT%" -c safe.directory=* -C "%FRESH%" commit -m "Add Papa's Flash games, use online Ruffle, remove Wormate.io"

echo.
echo ================================================
echo  DONE. Now in GitHub Desktop:
echo   1. File ^> Add local repository
echo   2. Choose: %FRESH%
echo   3. Click "Push origin"
echo  (If it says "nothing to commit", just push anyway.)
echo ================================================
start "" explorer "%FRESH%"
pause
