@echo off
REM OUI Database Updater for Windows
REM Downloads latest OUI databases and merges them

echo.
echo ====================================
echo    OUI Database Updater
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

echo [Step 1/2] Downloading latest OUI databases...
echo.
bash download-sources.sh
if errorlevel 1 (
    echo ERROR: Download failed!
    pause
    exit /b 1
)

echo.
echo [Step 2/2] Merging databases into master list...
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
echo Location: output\master_oui.csv
echo.
type output\stats.txt
echo.
pause
