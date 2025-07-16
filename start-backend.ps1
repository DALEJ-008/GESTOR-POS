# Script para iniciar el servidor backend de Django
# Archivo: start-backend.ps1

Write-Host "🚀 Iniciando servidor backend Django..." -ForegroundColor Green

# Cambiar al directorio del backend
Set-Location "C:\Users\dnalj\GESTOR\backend"

# Verificar si el entorno virtual existe
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "📦 Activando entorno virtual..." -ForegroundColor Yellow
    & .\venv\Scripts\Activate.ps1
}

# Verificar si hay migraciones pendientes
Write-Host "🔍 Verificando migraciones..." -ForegroundColor Yellow
python manage.py showmigrations --plan

# Aplicar migraciones si es necesario
Write-Host "📊 Aplicando migraciones..." -ForegroundColor Yellow
python manage.py migrate

# Iniciar el servidor
Write-Host "🌐 Iniciando servidor en http://127.0.0.1:8000/" -ForegroundColor Green
python manage.py runserver

# Pausar al final para ver errores si los hay
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al iniciar el servidor" -ForegroundColor Red
    Read-Host "Presiona Enter para continuar"
}
