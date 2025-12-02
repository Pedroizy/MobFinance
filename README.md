# 📱 MobFinance — App de Controle Financeiro

![Badge Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Badge Expo](https://img.shields.io/badge/expo-54.0-blue)
![Badge ReactNative](https://img.shields.io/badge/react--native-0.81-purple)
![Badge Prisma](https://img.shields.io/badge/prisma-6.0-brightgreen)
![Badge License](https://img.shields.io/badge/licença-MIT-green)

O **MobFinance** é um aplicativo mobile criado com **React Native + Expo** e **Prisma ORM** para ajudar você a organizar suas finanças de forma simples, rápida e eficiente.

Com ele, você consegue visualizar seu saldo, acompanhar suas entradas e saídas, gerenciar transações e muito mais — tudo em uma interface moderna e amigável, com banco de dados local SQLite.

---

# 🚀 Funcionalidades

- ✅ Cadastro e autenticação de usuários
- ✅ Login com email e senha (criptografia SHA-256)
- ✅ Visualização de saldo atual  
- ✅ Listagem de movimentações (entradas e saídas)  
- ✅ Criação e exclusão de transações
- ✅ Persistência de dados com Prisma + SQLite
- ✅ Interface leve e moderna  
- ✅ Gerenciamento de sessão com AsyncStorage

---

# 🗄️ Banco de Dados

O projeto utiliza **Prisma ORM** com **SQLite** para armazenamento local de dados.

### Modelos:

**User**
- id (UUID)
- nome
- sobrenome
- email (único)
- senha (hash SHA-256)
- transactions (relação)

**Transaction**
- id (UUID)
- tipo (entrada/saida)
- descricao
- valor
- data
- userId (FK)

---

# 👥 Equipe de Desenvolvimento

### **1. Pedro Izidio — Líder e Portela Front-end & Arquitetura**
- Organização da estrutura do projeto  
- Criação da arquitetura base e navegação  
- Desenvolvimento das telas e integração entre componentes  

### **2. Pedro Izidio — Desenvolvedor de Componentes**
- Construção de componentes reutilizáveis  
- Responsável por Header, Balance, Movements, Actions  

### **3. Rick — Designer UX/UI**
- Definição das cores, tipografia e estilo visual  
- Criação dos layouts e protótipos  
- Garantia da boa experiência do usuário  

### **4. Paulista — Lógica de Dados**
- Implementação da estrutura de dados  
- Organização de estados e fluxo interno  
- Lógica da listagem de movimentações  

### **5. Indiano(Alfred) — Documentação e Testes**
- Escrita de documentação  
- Testes manuais de interface  
- Revisão e padronização do código  

---

# 📂 Estrutura de Pastas

```
MobFinance/
│
├── .expo/
├── assets/
│   └── images/
│
├── backend/                # Backend Node.js + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── transactions.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── db.js
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados (mobile mock)
│   └── dev.db            # Banco SQLite (gerado)
│
├── src/
│   ├── components/
│   │   ├── Actions/
│   │   ├── Balance/
│   │   ├── Header/
│   │   └── Movements/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── login.js
│   │   │   └── home1.js
│   │   └── Cadastro/
│   │       └── Cadastro.js
│   │
│   ├── services/
│   │   ├── api.js         # Funções de API (mock local ou backend)
│   │   └── database.js    # Mock usando AsyncStorage
│   │
│   └── Routes.js
│
├── .env                   # Variáveis de ambiente
├── App.js
├── app.json
├── babel.config.js
├── index.js
├── package.json
└── README.md
```

---

# 🧪 Tecnologias Utilizadas

- **React Native**
- **Expo**
- **Prisma ORM**
- **SQLite**
- **AsyncStorage**
- **expo-crypto** (criptografia de senhas)
- JavaScript ES6+
- Componentes funcionais
- React Navigation

---

# ▶️ Como Rodar o Projeto

## 🚀 Início Rápido

### **Pré-requisitos**
- Node.js (versão 18 ou superior) - [Download aqui](https://nodejs.org)
- npm (vem com Node.js)
- Expo Go no celular - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779)

### **Primeira vez? Instale as dependências:**

```bash
# Na raiz do projeto
npm install

# No backend
cd backend
npm install
npm run prisma:push
cd ..
```

---

## ⚡ Métodos para Iniciar

### **Método 1: Script Automático (Mais Fácil)**

Abre 2 terminais automaticamente:

```bash
.\start.ps1
```

Ou:
```bash
npm run dev
```

### **Método 2: Manual (Recomendado - Mata processos anteriores)**

**Execute no PowerShell na pasta do projeto:**

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\vjona\Downloads\MobFinance\backend'; Write-Host '🚀 Backend' -ForegroundColor Green; npm start"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\vjona\Downloads\MobFinance'; Write-Host '📱 Frontend' -ForegroundColor Cyan; npm start"
```

> **⚠️ Importante:** Esse método garante que nenhum processo Node.js anterior está rodando e abre os dois terminais corretamente. Ajuste os caminhos se o projeto estiver em outra pasta.

### **Método 3: Manual Simples (2 Comandos)**

**Abra o PowerShell na pasta do projeto e execute:**

```bash
# Terminal 1 - Backend
cd backend
npm start
```

**Abra OUTRO PowerShell na pasta do projeto e execute:**

```bash
# Terminal 2 - Frontend  
npm start
```

### **Método 3: Um de cada vez**

**Apenas Backend:**
```bash
npm run backend
```

**Apenas Frontend:**
```bash
npm start
```

---

## 📱 Acessando o App

Após iniciar, você verá um **QR Code** no terminal do frontend.

### **No celular:**
1. Abra o app **Expo Go**
2. Escaneie o QR Code
3. Aguarde carregar

### **No computador:**
Pressione no terminal do frontend:
- **w** → Abre no navegador (Web)
- **a** → Abre no emulador Android
- **i** → Abre no simulador iOS (apenas macOS)

---

## ✅ Como Saber se Está Funcionando?

### **Backend (deve mostrar):**
```
🚀 Servidor rodando na porta 3000
📡 API disponível em http://localhost:3000
```

### **Frontend (deve mostrar um QR Code e):**
```
› Metro waiting on exp://...
› Using Expo Go
```

### **Testar a API:**
```bash
npm run backend:test
```

---

## 🛑 Como Parar

Pressione **Ctrl + C** em cada terminal (backend e frontend)

---

## ⚙️ Configuração Avançada

### **Mudou de rede WiFi ou IP?**

1. Descubra seu novo IP:
   ```bash
   ipconfig | Select-String "IPv4"
   ```

2. Atualize em `src/services/apiBackend.js` (linha 5):
   ```javascript
   const API_URL = 'http://SEU_NOVO_IP:3000/api'
   ```

### **URLs por Plataforma:**

| Onde você está testando | URL da API |
|-------------------------|------------|
| Navegador Web | `http://localhost:3000/api` |
| iOS Simulator | `http://localhost:3000/api` |
| Android Emulator | `http://10.0.2.2:3000/api` |
| Celular Físico | `http://SEU_IP:3000/api` |

---

## 🐛 Problemas Comuns

### ❌ "npm não é reconhecido"
**Solução:** Instale o Node.js: https://nodejs.org

### ❌ "Expo não encontrado"
**Solução:**
```bash
npm install -g expo-cli
```

### ❌ Backend não inicia
**Solução:**
```bash
cd backend
npm install
npm run prisma:push
npm start
```

### ❌ "Erro de conexão" no app
**Soluções:**
1. Verifique se o backend está rodando
2. Celular e PC devem estar na **mesma rede WiFi**
3. Verifique o IP em `src/services/apiBackend.js`
4. Desabilite firewall temporariamente

### ❌ Porta 3000 já em uso
**Solução:**
```bash
# Encontre o processo
netstat -ano | findstr :3000

# Mate o processo (substitua PID pelo número encontrado)
taskkill /PID numero_do_pid /F
```

---

## 📋 Resumo dos Comandos

```bash
# Instalar tudo
npm install
cd backend && npm install && npm run prisma:push && cd ..

# Iniciar tudo (escolha um)
.\start.ps1              # Abre 2 terminais
npm run dev              # Mesmo que acima
npm run backend          # Só backend
npm start                # Só frontend

# Testar
npm run backend:test     # Testa a API

# Ver banco de dados
cd backend
npm run prisma:studio    # Abre interface visual
```

---

# 🔧 Scripts Disponíveis

### Principais (raiz do projeto)
```bash
npm run dev          # 🚀 Inicia backend + frontend (2 terminais)
npm start            # 📱 Inicia apenas o Expo
npm run backend      # 🔧 Inicia apenas o backend
npm run backend:test # 🧪 Testa a API do backend
npm run android      # Abre no Android
npm run ios          # Abre no iOS
npm run web          # Abre no navegador
```

### Backend (pasta backend/)
```bash
npm start                # Inicia servidor (produção)
npm run dev              # Inicia com nodemon (desenvolvimento)
npm run prisma:generate  # Gera o Prisma Client
npm run prisma:migrate   # Cria migrations
npm run prisma:studio    # Abre interface visual do banco
npm run prisma:push      # Sincroniza schema com o banco
```

### Scripts PowerShell
```bash
.\start.ps1          # Abre backend + frontend em terminais separados
.\start-dev.ps1      # Inicia tudo em um terminal (avançado)
```

---

# 🤝 Como Contribuir

1. Faça um fork do projeto  
2. Crie uma branch:  
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas mudanças:  
   ```bash
   git commit -m "Minha nova feature"
   ```
4. Envie a branch:  
   ```bash
   git push origin minha-feature
   ```
   
---

# 💚 Agradecimentos

Obrigado por acompanhar o projeto!  
Se quiser sugerir melhorias ou contribuir, fique à vontade! 😊
