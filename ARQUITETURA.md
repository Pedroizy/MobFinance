# IMPORTANTE - Sobre a Arquitetura do Projeto

## ⚠️ Nota sobre Prisma e React Native

**Prisma NÃO funciona diretamente em React Native**, pois é um ORM para Node.js que requer acesso ao sistema de arquivos e módulos nativos do Node.

### Solução Implementada - Arquitetura Híbrida

Este projeto oferece **duas opções de funcionamento**:

#### 1. **Mock Local (Desenvolvimento Offline)**
- Armazena dados localmente no dispositivo usando AsyncStorage
- Funciona sem conexão com backend
- Ideal para desenvolvimento e testes iniciais
- Implementado em `src/services/database.js` e `src/services/api.js`

#### 2. **Backend Real (Produção) ✅ RECOMENDADO**
- Backend Node.js completo na pasta `backend/`
- Usa Prisma ORM + SQLite
- Autenticação JWT
- API REST completa

### Estrutura do Projeto

```
MobFinance/
├── backend/              ← Backend Node.js + Prisma
│   ├── src/
│   │   ├── routes/      ← Rotas de API
│   │   ├── middleware/  ← Autenticação JWT
│   │   └── server.js    ← Servidor Express
│   └── prisma/
│       └── schema.prisma
│
└── src/                  ← App React Native
    ├── pages/
    ├── components/
    └── services/
        ├── api.js        ← Pode usar mock OU backend
        └── database.js   ← Mock AsyncStorage
```

### Como Usar

#### Opção A: Com Backend (Recomendado)
1. Inicie o backend:
   ```bash
   cd backend
   npm start
   ```

2. Configure a URL no app mobile em `src/services/api.js`:
   ```javascript
   const API_URL = 'http://SEU_IP:3000/api';
   // Para emulador Android: http://10.0.2.2:3000/api
   // Para iOS: http://localhost:3000/api
   // Para dispositivo físico: http://192.168.x.x:3000/api
   ```

3. Substitua as funções em `src/services/api.js` para usar fetch():
   ```javascript
   export async function loginUser(email, password) {
     const response = await fetch(`${API_URL}/auth/login`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, senha: password })
     });
     return await response.json();
   }
   ```

#### Opção B: Mock Local (Atual)
- Funciona automaticamente
- Dados salvos apenas no dispositivo
- Sem necessidade de backend rodando

### Endpoints do Backend

- `POST /api/auth/signup` - Cadastro
- `POST /api/auth/login` - Login (retorna token JWT)
- `GET /api/transactions` - Listar transações (requer token)
- `POST /api/transactions` - Criar transação (requer token)
- `DELETE /api/transactions/:id` - Deletar (requer token)
- `GET /api/transactions/balance` - Saldo (requer token)

### Para Migrar do Mock para Backend

1. Inicie o backend
2. Atualize `src/services/api.js` para fazer requisições HTTP
3. Armazene o token JWT no AsyncStorage após login
4. Envie o token em todas as requisições protegidas

Por enquanto, o app funciona perfeitamente com o mock local! 🚀

Para usar o backend real, veja a documentação em `backend/README.md`

