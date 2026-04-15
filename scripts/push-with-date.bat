@echo off
REM Windows batch script for git commit and push with specific date/time
REM April 14, 2026 at 4:28 AM

setlocal enabledelayedexpansion

set COMMIT_DATE=2026-04-14T04:28:00
set COMMIT_MESSAGE=%1
if "!COMMIT_MESSAGE!"=="" (
    set COMMIT_MESSAGE=Docker setup: Backend ready for Docker implementation
)

REM Create commit with backdated timestamp
git commit --allow-empty -m "!COMMIT_MESSAGE!" --date="!COMMIT_DATE!"

REM Push to remote
git push origin main

echo.
echo Commit created with date: %COMMIT_DATE%
echo Changes pushed to remote repository
pause
