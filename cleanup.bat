@echo off
echo ========================================
echo Очистка проекта перед деплоем
echo ========================================
echo.

echo Удаление .next...
if exist .next rmdir /s /q .next

echo Удаление node_modules...
if exist node_modules rmdir /s /q node_modules

echo Удаление базы данных...
if exist data rmdir /s /q data

echo Удаление логов...
del /q *.log 2>nul

echo.
echo ========================================
echo Очистка завершена!
echo ========================================
echo.
echo Теперь можно:
echo 1. Установить зависимости: npm install
echo 2. Собрать проект: npm run build
echo 3. Задеплоить на сервер
echo.
pause
