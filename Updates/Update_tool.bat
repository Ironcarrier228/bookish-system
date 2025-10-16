@echo off
title Git Update Tool - by Ironcarrier
color 0a

echo ================================================
echo         Git Update Manager for Website
echo ================================================
echo [1] Safe Auto Update (commit + pull + push)
echo [2] Hard Reset (discard all local changes)
echo [3] Force Push (overwrite GitHub with local)
echo [0] Exit
echo ================================================
set /p choice="Choose an option: "

if "%choice%"=="1" goto auto
if "%choice%"=="2" goto hard
if "%choice%"=="3" goto force
if "%choice%"=="0" exit
goto end

:auto
echo --------------------------------
echo [1/3] Adding all files...
git add .

echo [2/3] Committing changes...
git commit -m "Auto update commit"

echo [3/3] Pulling and pushing...
git pull --rebase origin main
git push -u origin main

echo  Done! Repository updated safely.
pause
goto end

:hard
echo --------------------------------
echo  WARNING: This will remove all local changes!
pause

echo [1/2] Resetting local files...
git reset --hard

echo [2/2] Pulling latest from GitHub...
git pull origin main

echo  Done! Repository fully synced with GitHub.
pause
goto end

:force
echo --------------------------------
echo ⚠ WARNING: This will overwrite GitHub repository!
pause

echo [1/3] Adding all files...
git add .

echo [2/3] Committing changes...
git commit -m "Force push update"

echo [3/3] Forcing push to GitHub...
git push origin main --force

echo Done! Remote repository overwritten successfully.
pause
goto end

:end
exit
