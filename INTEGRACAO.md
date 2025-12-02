# 🔌 Guia de Integração Backend + Frontend

## 📱 Conectando o App ao Backend

### 1️⃣ **Iniciar o Backend**

Em um terminal:
```bash
cd backend
npm start
```

O servidor estará rodando em `http://localhost:3000`

### 2️⃣ **Configurar URL da API**

Edite `src/services/apiBackend.js` na linha 5:

```javascript
const API_URL = __DEV__ 
  ? 'http://SEU_IP:3000/api'  // ← COLOQUE SEU IP AQUI
  : 'https://sua-api-producao.com/api';
```

**Como descobrir seu IP:**

**Windows (PowerShell):**
```powershell
ipconfig | Select-String "IPv4"
```

**macOS/Linux:**
```bash
ifconfig | grep "inet "
```

**URLs por plataforma:**

| Plataforma | URL |
|------------|-----|
| **Web** | `http://localhost:3000/api` |
| **iOS Simulator** | `http://localhost:3000/api` |
| **Android Emulator** | `http://10.0.2.2:3000/api` |
| **Dispositivo Físico** | `http://SEU_IP:3000/api` (ex: `192.168.1.100`) |

### 3️⃣ **Iniciar o App**

Em outro terminal:
```bash
npm start
```

### 4️⃣ **Testar**

1. Abra o app
2. Crie uma conta na tela de cadastro
3. Faça login
4. Os dados serão salvos no backend! 🎉

---

## 🔀 Alternar entre Mock e Backend

O app está configurado para usar o **backend por padrão**.

**Para usar Mock Local (sem backend):**

Edite `src/pages/Home/login.js` e `src/pages/Cadastro/Cadastro.js`:

```javascript
// Trocar de:
import { loginUser } from "../../services/apiBackend";

// Para:
import { loginUser } from "../../services/api";
```

---

## 🧪 Testando a API

### Via PowerShell:

**Cadastro:**
```powershell
$body = @{
    nome = "Pedro"
    sobrenome = "Izidio"
    email = "pedro@mob.com"
    senha = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" -Method POST -ContentType "application/json" -Body $body
```

**Login:**
```powershell
$body = @{
    email = "pedro@mob.com"
    senha = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
```

### Via Postman/Insomnia:

Importe a collection de testes (veja `backend/README.md`)

---

## 🔐 Autenticação

O backend usa **JWT (JSON Web Tokens)**.

**Fluxo:**
1. Usuário faz login/cadastro
2. Backend retorna `token` JWT
3. App salva token no `AsyncStorage`
4. Todas as requisições seguintes enviam: `Authorization: Bearer {token}`

**Token armazenado em:**
- `@token` - Token JWT
- `@user` - Dados do usuário

---

## 📂 Estrutura de Arquivos

```
src/services/
├── api.js           ← Mock local (AsyncStorage)
├── apiBackend.js    ← Conexão com backend real ✅
├── database.js      ← Mock do Prisma (AsyncStorage)
└── config.js        ← Configurações
```

**Páginas atualizadas:**
- ✅ `src/pages/Home/login.js` - Usando apiBackend
- ✅ `src/pages/Cadastro/Cadastro.js` - Usando apiBackend

---

## ⚙️ Configurações Avançadas

### Timeout de Requisições

Edite `src/services/apiBackend.js`:

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s

const response = await fetch(url, {
  ...config,
  signal: controller.signal
});
```

### HTTPS em Produção

1. Configure SSL no backend
2. Atualize `API_URL` para `https://...`
3. Para desenvolvimento, aceite certificados self-signed

### Logs de Debug

Ative logs detalhados:

```javascript
// No apiBackend.js
console.log('Request:', endpoint, method, body);
console.log('Response:', data);
```

---

## 🐛 Troubleshooting

### ❌ "Erro de conexão"
- ✅ Backend está rodando? (`cd backend && npm start`)
- ✅ URL está correta? (verifique seu IP)
- ✅ Firewall bloqueando? (desabilite temporariamente)
- ✅ Mesma rede? (dispositivo e PC na mesma WiFi)

### ❌ "Token inválido"
- Faça logout e login novamente
- Limpe AsyncStorage: `await AsyncStorage.clear()`

### ❌ "CORS error" (apenas web)
- Backend já tem CORS habilitado
- Verifique se `cors()` está no `server.js`

### ❌ Android não conecta
- Use `http://10.0.2.2:3000/api` para emulador
- Para físico, use IP da máquina na rede local

---

## ✅ Checklist de Integração

- [ ] Backend rodando (`cd backend && npm start`)
- [ ] IP configurado em `apiBackend.js`
- [ ] App mobile iniciado (`npm start`)
- [ ] Cadastro funcionando
- [ ] Login funcionando
- [ ] Token sendo salvo
- [ ] Requisições autenticadas funcionando

---

## 📚 Próximos Passos

1. Criar tela principal após login
2. Listar transações
3. Adicionar/deletar transações
4. Exibir saldo
5. Implementar refresh/pull-to-refresh
6. Adicionar loading states
7. Tratamento de erros melhorado

---

**Dúvidas?** Consulte:
- `backend/README.md` - Documentação do backend
- `ARQUITETURA.md` - Arquitetura do projeto
