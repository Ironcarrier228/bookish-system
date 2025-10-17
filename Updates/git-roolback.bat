@echo off
title Git Rollback Helper
color 0a

echo ================================
echo   Git Rollback Utility (BAT)
echo ================================
echo.

:: Check if this is a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [Error] This is not a git repository!
    pause
    exit /b
)

:: Check if a rebase is in progress
if exist ".git\rebase-merge" (
    echo [Error] A rebase is currently in progress!
    echo Please finish or abort the rebase before running this script.
    pause
    exit /b
)
if exist ".git\rebase-apply" (
    echo [Error] A rebase is currently in progress!
    echo Please finish or abort the rebase before running this script.
    pause
    exit /b
)

:: Check for uncommitted changes
git diff --quiet
if errorlevel 1 (
    echo.
    echo [Warning] You have uncommitted changes.
    choice /m "Do you want to stage all changes (git add .) before rollback?"
    if errorlevel 2 (
        echo Skipping staging...
    ) else (
        git add .
        echo All changes staged.
    )
)

:: Show the last 10 commits
echo.
echo Last 10 commits:
git log --oneline -n 10
echo.

:: Ask for commit hash
set /p commit="Enter commit hash (or first few characters): "
if "%commit%"=="" (
    echo [Error] No commit hash entered!
    pause
    exit /b
)

:: Choose rollback mode
echo.
echo Choose rollback mode:
echo   1 - reset --hard (full rollback, all changes lost)
echo   2 - reset --soft (rollback, keep changes staged)
echo   3 - revert (create a new commit that undoes the chosen one)
set /p mode="Your choice (1/2/3): "

if "%mode%"=="1" (
    git reset --hard %commit%
    goto done
)
if "%mode%"=="2" (
    git reset --soft %commit%
    goto done
)
if "%mode%"=="3" (
    git revert %commit%
    goto done
)

echo [Error] Invalid choice!
pause
exit /b

:done
echo.
echo ✅ Rollback completed successfully.
pause
