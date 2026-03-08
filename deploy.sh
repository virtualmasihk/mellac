#!/bin/bash

echo "========================================="
echo "MellAC Deployment Script"
echo "========================================="
echo ""

# Удаление старых файлов
echo "Cleaning old files..."
rm -rf node_modules
rm -rf .next
rm -f package-lock.json
rm -f pnpm-lock.yaml

# Установка зависимостей
echo ""
echo "Installing dependencies..."
npm install

# Сборка проекта
echo ""
echo "Building project..."
npm run build

# Запуск
echo ""
echo "Starting server..."
npm start
