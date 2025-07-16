# Script para iniciar el servidor frontend de React
# Archivo: start-frontend.ps1

Write-Host "🚀 Iniciando servidor frontend React..." -ForegroundColor Green

# Cambiar al directorio del frontend
Set-Location "C:\Users\dnalj\GESTOR\frontend"

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Verificar versión de Node.js
Write-Host "🔍 Verificando versión de Node.js..." -ForegroundColor Yellow
node --version
npm --version

# Limpiar cache de npm
Write-Host "🧹 Limpiando cache..." -ForegroundColor Yellow
npm cache clean --force

# Iniciar el servidor de desarrollo
Write-Host "🌐 Iniciando servidor en http://localhost:3001/" -ForegroundColor Green
npx vite --port 3001 --host 0.0.0.0

# Pausar al final para ver errores si los hay
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al iniciar el servidor" -ForegroundColor Red
    Read-Host "Presiona Enter para continuar"
}
