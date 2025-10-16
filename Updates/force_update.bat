@echo off
title ⚡ Принудительный пуш на GitHub
echo ==========================================
echo ⚠️ Этот пуш заменит удалённую версию твоей локальной!
pause

git add .
git commit -m "Принудительное обновление сайта"
git push origin main --force

echo ✅ Код на GitHub полностью перезаписан твоей версией.
pause
