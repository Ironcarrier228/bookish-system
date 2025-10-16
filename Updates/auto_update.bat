@echo off
title 🚀 Автообновление сайта (без потери данных)
echo ==========================================
echo [1/3] Добавляю файлы...
git add .

echo [2/3] Делаю коммит...
git commit -m "Автоматическое обновление сайта"

echo [3/3] Подтягиваю и отправляю на GitHub...
git pull --rebase origin main
git push -u origin main

echo ✅ Готово! Сайт успешно обновлён.
pause
