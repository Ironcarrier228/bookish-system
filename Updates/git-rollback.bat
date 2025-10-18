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
    goto end
)

:: Check if a rebase is in progress
if exist ".git\rebase-merge" (
    echo [Error] A rebase is currently in progress!
    echo Please finish or abort the rebase before running this script.
    goto end
)
if exist ".git\rebase-apply" (
    echo [Error] A rebase is currently in progress!
    echo Please finish or abort the rebase before running this script.
    goto end
)

:: Check for uncommitted changes
git diff --quiet
if errorlevel 1 (
    echo.
    echo [Warning] You have uncommitted changes.
    echo Do you want to stage all changes before rollback?
    echo Press Y for Yes, N for No
    choice /c YN /n
    if %errorlevel%==1 (
        git add .
        echo All changes staged.
    ) else (
        echo Skipping staging...
    )
)

:: Show all commits
echo.
echo All commits:
git log --oneline --all --graph --decorate
echo.

:: Ask for commit hash
set /p commit="Enter commit hash (or first few characters): "
if "%commit%"=="" (
    echo [Error] No commit hash entered!
    goto end
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
    if errorlevel 1 (
        echo [Error] Reset failed.
        goto end
    )
    goto done
)

if "%mode%"=="2" (
    git reset --soft %commit%
    if errorlevel 1 (
        echo [Error] Reset failed.
        goto end
    )
    goto done
)

if "%mode%"=="3" (
    git revert %commit%
    if errorlevel 1 (
        echo [Error] Revert failed due to conflicts.
        echo ----------------------------------------
        echo Conflicts detected!
        echo You have two options:
        echo.
        echo [M] Handle manually:
        echo   - Open conflict files in VS Code
        echo   - Fix the code manually and save files
        echo   - Run: git add .
        echo   - Run: git revert --continue
        echo.
        echo [A] Let script try to auto-finish
        echo.
        echo Press M for Manual, A for Auto
        choice /c MA /n
        if %errorlevel%==2 (
            echo Running auto-resolve...
            git add .
            git revert --continue
            if errorlevel 1 (
                echo [Error] Auto-resolve failed. Please fix manually.
                echo After fixing run: git add . and git revert --continue
                goto end
            )
            echo Auto-resolve completed.
            goto done
        ) else (
            echo.
            echo Please resolve conflicts manually:
            echo   1. Open conflict files and fix them
            echo   2. Run: git add .
            echo   3. Run: git revert --continue
            echo   4. Then you can push changes if needed
            echo.
            goto end
        )
    )
    goto done
)

echo [Error] Invalid choice!
goto end

:done
echo.
echo [Success] Rollback completed successfully.
echo.

:: Ask if user wants to push changes
echo Do you want to push changes to GitHub now?
echo Press Y for Yes, N for No
choice /c YN /n
if %errorlevel%==1 (
    if "%mode%"=="1" (
        echo.
        echo You used reset --hard. Normal push may fail.
        echo Do you want to force push?
        echo Press Y for Yes, N for No
        choice /c YN /n
        if %errorlevel%==1 (
            git push --force
        ) else (
            git push
        )
    ) else (
        git push
    )
    goto end
) else (
    echo Skipping push...
    goto end
)

:end
echo.
echo Script finished. Press any key to exit.
pause >nul