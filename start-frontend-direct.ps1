# Script simple para iniciar el frontend
Set-Location "C:\Users\dnalj\GESTOR\frontend"
Write-Host "Iniciando servidor de frontend..." -ForegroundColor Green

# Instalar dependencias si es necesario
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Iniciar el servidor
Write-Host "Ejecutando servidor en puerto 3001..." -ForegroundColor Green
& npm run dev
