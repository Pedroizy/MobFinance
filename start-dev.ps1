# Script para iniciar Backend + Frontend juntos
# Execute: .\start-dev.ps1

Write-Host "🚀 Iniciando MobFinance - Backend + Frontend" -ForegroundColor Cyan
Write-Host ""

# Verifica se Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "   Instale em: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Caminho do projeto
$projectPath = $PSScriptRoot
$backendPath = Join-Path $projectPath "backend"

# Verificar se as dependências estão instaladas
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow

# Backend
if (!(Test-Path "$backendPath\node_modules")) {
    Write-Host "   Instalando dependências do backend..." -ForegroundColor Yellow
    Set-Location $backendPath
    npm install
    Set-Location $projectPath
}

# Frontend
if (!(Test-Path "$projectPath\node_modules")) {
    Write-Host "   Instalando dependências do frontend..." -ForegroundColor Yellow
    npm install
}

Write-Host "✅ Dependências verificadas!" -ForegroundColor Green
Write-Host ""

# Iniciar Backend em processo separado
Write-Host "🔧 Iniciando Backend (porta 3000)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    node src/server.js
} -ArgumentList $backendPath

Start-Sleep -Seconds 2

# Verificar se backend iniciou
try {
    $null = Invoke-RestMethod -Uri "http://localhost:3000" -Method GET -TimeoutSec 2
    Write-Host "✅ Backend rodando em http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend pode demorar alguns segundos para iniciar..." -ForegroundColor Yellow
}
Write-Host ""

# Iniciar Frontend
Write-Host "📱 Iniciando Frontend (Expo)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Função para limpar jobs ao sair
$cleanup = {
    Write-Host ""
    Write-Host "🛑 Encerrando servidores..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Servidores encerrados!" -ForegroundColor Green
}

# Registrar evento de saída
Register-EngineEvent PowerShell.Exiting -Action $cleanup

try {
    # Iniciar Expo (este comando bloqueia até Ctrl+C)
    npm start
} finally {
    # Limpar ao sair
    & $cleanup
}
