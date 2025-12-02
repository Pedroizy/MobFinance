#  MobFinance Backend API

Backend Node.js com Express e Prisma para o aplicativo MobFinance.

##  Tecnologias

- Node.js
- Express
- Prisma ORM
- SQLite
- JWT (autenticação)
- Bcrypt (hash de senhas)

##  Instalação

```bash
npm install
npm run prisma:push
```

##  Executar

```bash
npm start        # Produção
npm run dev      # Desenvolvimento (com nodemon)
```

##  Endpoints

### Autenticação

**POST** `/api/auth/signup` - Cadastro
```json
{
  "nome": "João",
  "sobrenome": "Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**POST** `/api/auth/login` - Login
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

### Transações (requer token)

**GET** `/api/transactions` - Listar todas
Headers: `Authorization: Bearer {token}`

**POST** `/api/transactions` - Criar
Headers: `Authorization: Bearer {token}`
```json
{
  "tipo": "entrada",
  "descricao": "Salário",
  "valor": 5000
}
```

**DELETE** `/api/transactions/:id` - Deletar
Headers: `Authorization: Bearer {token}`

**GET** `/api/transactions/balance` - Saldo
Headers: `Authorization: Bearer {token}`

##  Scripts

```bash
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Cria migrations
npm run prisma:studio    # Abre interface do banco
npm run prisma:push      # Sincroniza schema
```

##  Variáveis de Ambiente

Arquivo `.env`:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3000
```

##  Testar API

Com curl/PowerShell:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/auth/signup -Method POST -ContentType "application/json" -Body '{"nome":"Pedro","sobrenome":"Izidio","email":"pedro@mob.com","senha":"123456"}'
```

Com Postman/Insomnia - importe a collection de testes.

##  Estrutura

```
MobFinance-Backend/
 prisma/
    schema.prisma
    dev.db
 src/
    routes/
       auth.js
       transactions.js
    middleware/
       auth.js
    db.js
    server.js
 .env
 package.json
```

##  Segurança

- Senhas hash com Bcrypt (10 rounds)
- Autenticação JWT (expira em 7 dias)
- Validações de entrada
- CORS habilitado

##  Integração com Mobile

No app React Native, configure a URL base:
```javascript
const API_URL = 'http://SEU_IP:3000/api';
// ou para emulador Android: http://10.0.2.2:3000/api
```

---

MobFinance  2025
