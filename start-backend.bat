@echo off
echo 🚀 Iniciando servidor backend Django...
cd /d "C:\Users\dnalj\GESTOR\backend"

REM Activar entorno virtual si existe
if exist "venv\Scripts\activate.bat" (
    echo 📦 Activando entorno virtual...
    call venv\Scripts\activate.bat
)

echo 📊 Aplicando migraciones...
python manage.py migrate

echo 🌐 Iniciando servidor en http://127.0.0.1:8000/
python manage.py runserver

pause
