# Script simples - Abre Backend e Frontend em terminais separados
# Execute: .\start.ps1

Write-Host "🚀 Iniciando MobFinance..." -ForegroundColor Cyan
Write-Host ""

$projectPath = $PSScriptRoot

# Terminal 1: Backend
Write-Host "📡 Abrindo terminal do Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\backend'; Write-Host '🔧 Backend - MobFinance' -ForegroundColor Green; Write-Host ''; npm start"

Start-Sleep -Seconds 1

# Terminal 2: Frontend
Write-Host "📱 Abrindo terminal do Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; Write-Host '📱 Frontend - MobFinance' -ForegroundColor Cyan; Write-Host ''; npm start"

Write-Host ""
Write-Host "✅ Terminais abertos!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Instruções:" -ForegroundColor Yellow
Write-Host "   • Backend: http://localhost:3000" -ForegroundColor White
Write-Host "   • Frontend: Aguarde o QR Code aparecer" -ForegroundColor White
Write-Host "   • Para fechar: Pressione Ctrl+C em cada terminal" -ForegroundColor White
Write-Host ""
