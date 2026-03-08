@echo off
echo ========================================
echo Создание ZIP архива для GitHub
echo ========================================
echo.

echo Удаление старого архива...
del mellac.zip 2>nul

echo Создание архива...
powershell -Command "Compress-Archive -Path app,components,lib,public,scripts,styles,MellAC,.env.example,.gitignore,components.json,next.config.mjs,package.json,postcss.config.mjs,tailwind.config.js,tsconfig.json,README.md -DestinationPath mellac.zip -Force"

echo.
echo ========================================
echo Готово! Файл: mellac.zip
echo ========================================
echo.
echo Теперь можно загрузить на GitHub
pause
