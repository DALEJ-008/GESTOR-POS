# Script mejorado para iniciar el servidor frontend
# Archivo: start-frontend-stable.ps1

Write-Host "Iniciando Gestor POS Frontend..." -ForegroundColor Green

# Función para verificar si el puerto está en uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
        return $connection
    } catch {
        return $false
    }
}

# Función para detener procesos en el puerto
function Stop-ProcessOnPort {
    param([int]$Port)
    Write-Host "Liberando puerto $Port..." -ForegroundColor Yellow
    try {
        # Buscar procesos usando el puerto
        $netstatOutput = netstat -ano | Select-String ":$Port\s"
        if ($netstatOutput) {
            $netstatOutput | ForEach-Object {
                $line = $_.Line
                $parts = $line -split '\s+' | Where-Object { $_ -ne '' }
                if ($parts.Count -ge 5) {
                    $processID = $parts[-1]
                    if ($processID -match '^\d+$' -and $processID -ne "0") {
                        try {
                            Write-Host "   Deteniendo proceso $processID..." -ForegroundColor Gray
                            Stop-Process -Id ([int]$processID) -Force -ErrorAction SilentlyContinue
                        } catch {
                            Write-Host "   No se pudo detener proceso $processID" -ForegroundColor Yellow
                        }
                    }
                }
            }
            Start-Sleep -Seconds 2
        }
    } catch {
        Write-Host "   Error al liberar puerto: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Cambiar al directorio del frontend
Set-Location "C:\Users\dnalj\GESTOR\frontend"

# Asegurar que Node.js esté en el PATH
$nodePath = "C:\Program Files\nodejs"
if (Test-Path $nodePath) {
    $env:PATH = "$nodePath;$env:PATH"
}

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "Error: No se encontró package.json en el directorio actual" -ForegroundColor Red
    Write-Host "Directorio actual: $(Get-Location)" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar si el puerto 3001 está ocupado
if (Test-Port -Port 3001) {
    Write-Host "Puerto 3001 está ocupado. Liberando..." -ForegroundColor Yellow
    Stop-ProcessOnPort -Port 3001
}

# Verificar node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error al instalar dependencias" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        exit 1
    }
}

# Mostrar información del sistema
Write-Host "Información del sistema:" -ForegroundColor Cyan
Write-Host "   Node.js: $(node --version)" -ForegroundColor Gray
Write-Host "   npm: $(npm --version)" -ForegroundColor Gray
Write-Host "   Directorio: $(Get-Location)" -ForegroundColor Gray

# Iniciar el servidor
Write-Host "Iniciando servidor en http://localhost:3001/" -ForegroundColor Green
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host "El navegador se abrirá automáticamente" -ForegroundColor Yellow

# Iniciar Vite
try {
    npx vite --port 3001 --host localhost
} catch {
    Write-Host "Error al iniciar el servidor" -ForegroundColor Red
    Write-Host "Intentando con configuración alternativa..." -ForegroundColor Yellow
    npm run dev
}

# Si llegamos aquí, el servidor se detuvo
Write-Host "Servidor detenido" -ForegroundColor Yellow
Read-Host "Presiona Enter para continuar"
