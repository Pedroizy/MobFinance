@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════╗
echo ║     🚀 INICIANDO MOBFINANCE 🚀        ║
echo ╚════════════════════════════════════════╝
echo.

REM Mata processos Node.js anteriores
echo ⏹️  Encerrando processos anteriores...
taskkill /F /IM node.exe >nul 2>&1

timeout /t 2 /nobreak >nul

REM Inicia Backend
echo.
echo 🔧 Abrindo Backend...
start "MobFinance - Backend" powershell -NoExit -Command "cd '%~dp0backend'; Write-Host '🚀 Backend rodando' -ForegroundColor Green; npm start"

timeout /t 3 /nobreak >nul

REM Inicia Frontend
echo 📱 Abrindo Frontend...
start "MobFinance - Frontend" powershell -NoExit -Command "cd '%~dp0'; Write-Host '📱 Frontend rodando' -ForegroundColor Cyan; npm start"

echo.
echo ✅ Tudo iniciado!
echo.
echo 📱 Aguarde o QR Code aparecer no terminal do Frontend
echo 🔧 Backend estará em http://localhost:3000
echo.
pause

REM COMO ABRIR O PRISMA:

echo cd backend; npx prisma studio
