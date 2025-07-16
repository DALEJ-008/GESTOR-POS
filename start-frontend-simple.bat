@echo off
cd /d "C:\Users\dnalj\GESTOR\frontend"
echo Iniciando servidor de frontend en puerto 3001...
npm run dev -- --port 3001 --host localhost
pause
