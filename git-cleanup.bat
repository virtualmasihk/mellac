@echo off
echo ========================================
echo Git Cleanup - Удаление лишних файлов
echo ========================================
echo.

echo Удаление node_modules из Git...
git rm -r --cached node_modules 2>nul

echo Удаление .next из Git...
git rm -r --cached .next 2>nul

echo Удаление базы данных из Git...
git rm -r --cached data 2>nul

echo Удаление логов из Git...
git rm --cached *.log 2>nul

echo Удаление lock файлов из Git...
git rm --cached package-lock.json 2>nul
git rm --cached pnpm-lock.yaml 2>nul

echo.
echo Коммит изменений...
git add .gitignore
git commit -m "Remove unnecessary files from git"

echo.
echo ========================================
echo Готово! Теперь можно пушить:
echo git push
echo ========================================
pause
