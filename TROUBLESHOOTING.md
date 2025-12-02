# 🐛 Guia de Troubleshooting - Erro 400

## ❌ Erro: "Failed to load resource: 400 (Bad Request)"

Este erro significa que o backend recebeu dados inválidos ou em formato incorreto.

---

## 🔍 Como Diagnosticar

### 1. **Verificar Logs**

**No terminal do Backend, você deve ver:**
```
📝 Cadastro - Body recebido: { nome, sobrenome, email, senha }
```
ou
```
🔑 Login - Body recebido: { email, senha }
```

**No terminal do Frontend (ou console do navegador), você deve ver:**
```
🔵 API Request: { url, method, body, headers }
🟢 API Response: { status, ok, data }
```

### 2. **Causas Comuns do Erro 400**

#### ✅ **Cadastro:**
- ❌ Falta algum campo (nome, sobrenome, email ou senha)
- ❌ Senha menor que 6 caracteres
- ❌ Email já cadastrado no banco
- ❌ Email em formato inválido

#### ✅ **Login:**
- ❌ Falta email ou senha
- ❌ Email ou senha incorretos

---

## 🔧 Soluções

### **Problema 1: "Todos os campos são obrigatórios"**

**Verifique se está enviando todos os dados:**

```javascript
// ❌ ERRADO
signupUser(nome, sobrenome, email); // Faltou senha

// ✅ CORRETO
signupUser(nome, sobrenome, email, senha);
```

**No código do cadastro (`src/pages/Cadastro/Cadastro.js`), linha ~35:**
```javascript
const result = await signupUser(nameTrimmed, surnameTrimmed, emailTrimmed, senha);
```

---

### **Problema 2: Senha muito curta**

A senha deve ter **no mínimo 6 caracteres**.

Verifique em `src/pages/Cadastro/Cadastro.js`:
```javascript
if (senha.length < 6) {
  Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
  return;
}
```

---

### **Problema 3: Email já cadastrado**

Se você tentar cadastrar o mesmo email duas vezes:

**Solução:**
1. Use outro email
2. Ou apague o banco e recrie:
   ```bash
   cd backend
   Remove-Item prisma\dev.db
   npm run prisma:push
   ```

---

### **Problema 4: Backend não está rodando**

**Verificar se o backend está ativo:**
```bash
Invoke-RestMethod http://localhost:3000
```

**Deve retornar:**
```json
{"message":"MobFinance API - Backend funcionando!"}
```

**Se não funcionar:**
```bash
cd backend
npm start
```

---

### **Problema 5: URL incorreta**

Verifique `src/services/apiBackend.js` linha 5:

```javascript
const API_URL = __DEV__ 
  ? 'http://SEU_IP:3000/api'  // ← Verifique este IP
  : 'https://sua-api-producao.com/api';
```

**Descobrir seu IP:**
```bash
ipconfig | Select-String "IPv4"
```

**URLs corretas por plataforma:**
- **Web:** `http://localhost:3000/api`
- **Android Emulator:** `http://10.0.2.2:3000/api`
- **Dispositivo Físico:** `http://SEU_IP:3000/api`

---

## 📋 Checklist de Debug

- [ ] Backend está rodando na porta 3000?
- [ ] Você vê os logs no terminal do backend?
- [ ] O IP em `apiBackend.js` está correto?
- [ ] Todos os campos do formulário estão preenchidos?
- [ ] A senha tem pelo menos 6 caracteres?
- [ ] Está na mesma rede WiFi (se usar dispositivo físico)?
- [ ] O email está em formato válido (ex: `usuario@dominio.com`)?

---

## 🧪 Teste Manual

Execute este teste para verificar se o backend funciona:

```bash
cd backend
.\test-api.ps1
```

Deve mostrar:
```
✅ Servidor está rodando!
✅ Cadastro realizado com sucesso!
✅ Login realizado com sucesso!
```

---

## 📞 Ainda com Problemas?

1. **Reinicie tudo:**
   ```bash
   # Feche todos os terminais (Ctrl+C)
   # Depois reinicie:
   .\start.ps1
   ```

2. **Limpe o cache:**
   ```bash
   # Frontend
   npx expo start -c
   
   # Backend
   cd backend
   npm run prisma:push
   ```

3. **Verifique o console do navegador (F12)**
   - Aba "Console" mostra erros JavaScript
   - Aba "Network" mostra requisições HTTP
   - Procure por erros em vermelho

---

## 🎯 Exemplo de Requisição Bem Sucedida

**Console do Frontend deve mostrar:**
```
🔵 API Request: {
  url: "http://10.10.35.63:3000/api/auth/signup",
  method: "POST",
  body: { nome, sobrenome, email, senha }
}
🟢 API Response: {
  status: 201,
  ok: true,
  data: { user, token }
}
```

**Terminal do Backend deve mostrar:**
```
📝 Cadastro - Body recebido: { nome: 'Pedro', sobrenome: 'Izidio', ... }
✅ Usuário criado: abc123 pedro@mob.com
```

---

## 💡 Dicas

- Sempre verifique os logs nos **dois** terminais (backend e frontend)
- Use o console do navegador (F12) para ver erros detalhados
- O erro 400 sempre vem com uma mensagem explicando o problema
- Teste a API direto com PowerShell antes de testar no app
