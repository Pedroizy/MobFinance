# 🚀 Início Rápido - MobFinance

## Método 1: Um comando (mais fácil)

```bash
.\start.ps1
```

Isso abrirá 2 terminais:
- 🔧 Backend (porta 3000)
- 📱 Frontend (Expo)

## Método 2: Usando npm

```bash
npm run dev
```

## Método 3: Manual (2 terminais)

**Terminal 1:**
```bash
cd backend
npm start
```

**Terminal 2:**
```bash
npm start
```

## 📝 Primeiro uso?

1. **Instale dependências:**
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

2. **Configure o backend:**
   ```bash
   cd backend
   npm run prisma:push
   cd ..
   ```

3. **Inicie tudo:**
   ```bash
   .\start.ps1
   ```

## ✅ Pronto!

- Backend: http://localhost:3000
- Frontend: Escaneie o QR code com Expo Go
- Ou pressione `w` para web

## 🧪 Testar se tá funcionando?

```bash
npm run backend:test
```

## 📱 URLs por plataforma

| Onde | URL da API |
|------|-----------|
| Web/iOS Simulator | `http://localhost:3000/api` |
| Android Emulator | `http://10.0.2.2:3000/api` |
| Dispositivo Físico | `http://SEU_IP:3000/api` |

Configure em: `src/services/apiBackend.js`

## 🆘 Problemas?

**Backend não inicia:**
```bash
cd backend
npm install
npm run prisma:push
npm start
```

**Frontend não conecta:**
- Verifique se o backend está rodando
- Confirme o IP em `src/services/apiBackend.js`
- Ambos devem estar na mesma rede WiFi

**Limpar tudo:**
```bash
# Frontend
rm -r node_modules
npm install

# Backend
cd backend
rm -r node_modules
npm install
npm run prisma:push
```

---

**Mais detalhes:** Veja `README.md` ou `INTEGRACAO.md`
