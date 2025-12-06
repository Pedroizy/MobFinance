const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

const app = express();

// ⚠️ NECESSÁRIO PARA LER JSON (não é middleware externo)
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'MobFinance API - Backend funcionando sem autenticação!' });
});

// Tratamento de erro básico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno!' });
});

const PORT = process.env.PORT || 3000;

app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor rodando em http://0.0.0.0:3000");
});

