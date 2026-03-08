@echo off
echo ========================================
echo Разархивация проекта
echo ========================================
echo.

set /p ZIPFILE="Введите имя ZIP файла (например, project.zip): "

if not exist "%ZIPFILE%" (
    echo ОШИБКА: Файл %ZIPFILE% не найден!
    pause
    exit /b 1
)

echo.
echo Разархивация %ZIPFILE%...
powershell -Command "Expand-Archive -Path '%ZIPFILE%' -DestinationPath '.' -Force"

if errorlevel 1 (
    echo ОШИБКА: Не удалось разархивировать!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Готово! Файлы извлечены в текущую папку
echo ========================================
echo.

echo Теперь можно:
echo 1. Установить зависимости: npm install
echo 2. Запустить проект: npm run dev
echo.
pause
