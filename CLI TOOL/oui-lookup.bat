@echo off
REM OUI Lookup Tool - Quick Launcher
REM Double-click to start interactive mode

cd /d "%~dp0"
node oui-lookup.js --interactive
pause
