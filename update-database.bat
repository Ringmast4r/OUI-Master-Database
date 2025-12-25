@echo off
REM OUI Database Updater for Windows
REM Downloads latest OUI databases and merges them

echo.
echo ====================================
echo    OUI Database Updater v2.0
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if bash is available (Git Bash)
bash --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Bash is not available!
    echo Please install Git for Windows from https://git-scm.com/
    pause
    exit /b 1
)

echo [Step 1/3] Installing dependencies...
echo.
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo [Step 2/3] Downloading latest OUI databases...
echo.
bash download-sources.sh
if errorlevel 1 (
    echo ERROR: Download failed!
    pause
    exit /b 1
)

echo.
echo [Step 3/3] Merging databases into master list...
echo.
node merge-oui-databases.js
if errorlevel 1 (
    echo ERROR: Merge failed!
    pause
    exit /b 1
)

echo.
echo ====================================
echo    Update Complete!
echo ====================================
echo.
echo Master database updated successfully!
echo Location: LISTS\master_oui.csv
echo.
echo Statistics:
type LISTS\stats.txt
echo.
pause
