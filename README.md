# MobFinance

MobFinance é uma aplicação para gerenciamento financeiro pessoal, composta por um backend em Node.js e um frontend em React Native.

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

## Estrutura do Projeto

A estrutura do projeto está organizada da seguinte forma:

```
MobFinance/
├── backend/                # Código do servidor (Node.js + Express)
│   ├── prisma/             # Configuração do Prisma ORM
│   ├── src/                # Código-fonte do backend
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── db.js           # Configuração do banco de dados
│   │   └── server.js       # Configuração do servidor
│   └── package.json        # Dependências do backend
├── src/                    # Código do frontend (React Native)
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── services/           # Serviços de API
│   └── Routes.js           # Configuração de navegação
├── assets/                 # Recursos estáticos (imagens, etc.)
├── package.json            # Dependências do frontend
└── README.md               # Documentação do projeto
```

---

## Como Rodar a Aplicação

### Pré-requisitos

- **Node.js** (v16 ou superior)
- **Expo CLI** (para rodar o frontend)
- **Banco de Dados**: Certifique-se de que o banco de dados está configurado corretamente (Prisma).

### Passo 1: Configurar o Backend

1. Navegue até a pasta `backend`:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   - Certifique-se de que o arquivo `.env` está configurado corretamente com as credenciais do banco de dados.
   - Rode as migrações do Prisma:
     ```bash
     npx prisma migrate dev
     ```

4. Inicie o servidor:
   ```bash
   cd backend, depois use npm start
   ```

5. O backend estará rodando em `http://localhost:3000`.

---

### Passo 2: Configurar o Frontend

1. Navegue até a raiz do projeto:
   
   depois abra um terminal novo, tem que deixar um terminal pro backend e pro front, separados
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Atualize o IP no arquivo `src/services/api.js` e `src/services/apiBackend.js`:
   - Substitua `192.168.1.32` pelo IP da máquina onde o backend está rodando.
   - Vá no terminal e  use ipconfig | findstr IPv4 e copie o IP que aparecer e substitua

4. Inicie o Expo:
   ```bash
   npm start
   ```

5. Escaneie o QR Code com o aplicativo Expo Go no seu dispositivo físico ou use um emulador.

---

## Observações

- Certifique-se de que o backend e o frontend estão na mesma rede para que possam se comunicar.
- Para apresentações, teste tudo com antecedência e ajuste os IPs conforme necessário.

---

## Contato

Para dúvidas ou sugestões, entre em contato com o seu Indiano amigo.