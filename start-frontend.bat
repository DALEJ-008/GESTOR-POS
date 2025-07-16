@echo off
title Gestor POS - Frontend Server
echo 🚀 Iniciando servidor frontend React...
cd /d "C:\Users\dnalj\GESTOR\frontend"

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
)

echo 🌐 Iniciando servidor en http://localhost:3001/
npx vite --port 3001 --host 0.0.0.0

pause
