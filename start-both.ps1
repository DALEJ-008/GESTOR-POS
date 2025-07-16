# Script para iniciar ambos servidores simultáneamente
# Archivo: start-both.ps1

Write-Host "Iniciando aplicación Gestor POS completa..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "Error: Debes ejecutar este script desde el directorio raíz del proyecto" -ForegroundColor Red
    Write-Host "Directorio actual: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "Directorio esperado: C:\Users\dnalj\GESTOR" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "Directorio del proyecto: $(Get-Location)" -ForegroundColor Green

# Función para iniciar backend en proceso separado
Write-Host "Iniciando backend en nueva ventana..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\dnalj\GESTOR\backend'; python manage.py runserver"

# Esperar un poco para que el backend inicie
Start-Sleep -Seconds 3

# Función para iniciar frontend en proceso separado
Write-Host "Iniciando frontend en nueva ventana..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\dnalj\GESTOR\frontend'; npx vite --port 3001 --host 0.0.0.0"

# Esperar un poco más
Start-Sleep -Seconds 5

Write-Host "Servidores iniciados:" -ForegroundColor Green
Write-Host "   Backend:  http://127.0.0.1:8000/" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3001/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tip: Para detener los servidores, cierra las ventanas de PowerShell o usa Ctrl+C" -ForegroundColor Yellow

# Verificar que los servidores estén corriendo
Write-Host "Verificando servidores..." -ForegroundColor Yellow
$backendRunning = $null -ne (netstat -an | findstr ":8000")
$frontendRunning = $null -ne (netstat -an | findstr ":3001")

if ($backendRunning) {
    Write-Host "Backend corriendo en puerto 8000" -ForegroundColor Green
} else {
    Write-Host "Backend no detectado en puerto 8000" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "Frontend corriendo en puerto 3001" -ForegroundColor Green
} else {
    Write-Host "Frontend no detectado en puerto 3001" -ForegroundColor Red
}

Read-Host "Presiona Enter para continuar"
