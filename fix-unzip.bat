@echo off
echo ========================================
echo Исправление структуры после разархивации
echo ========================================
echo.

set /p FOLDER="Введите имя папки после разархивации (например, mellac-main): "

if not exist "%FOLDER%" (
    echo ОШИБКА: Папка %FOLDER% не найдена!
    pause
    exit /b 1
)

echo.
echo Перемещение файлов из %FOLDER% в текущую папку...

xcopy "%FOLDER%\*" "." /E /H /Y

echo.
echo Удаление пустой папки %FOLDER%...
rmdir /S /Q "%FOLDER%"

echo.
echo ========================================
echo Готово! Структура исправлена
echo ========================================
echo.
echo Теперь можно:
echo 1. npm install
echo 2. npm run dev
echo.
pause
