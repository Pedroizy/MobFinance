**COMO ABRIR O PRISMA:**

cd backend; npx prisma studio

**FAÇA ISSO ANTES DE RODAR O PROJETO:**

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

**RODAR O BACKEND:**

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\vjona\Downloads\MobFinance\backend'; Write-Host '🚀 Backend' -ForegroundColor Green; npm start"

**RODAR O FRONTEND:**

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\vjona\Downloads\MobFinance'; Write-Host '📱 Frontend' -ForegroundColor Cyan; npm start"


**ISSO TUDO É COLOCADO NO TERMINAL**




**PRA EVITAR PROBLEMAS DE UM NPM INSTALL**