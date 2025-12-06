const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../db');

const router = express.Router();

// Armazenamento temporário de códigos de recuperação (em produção use Redis ou banco)
const recoveryCodes = new Map();

// Cadastro
router.post('/signup', async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;

  try {
    // Verificar se o email já está cadastrado
    const existingUser = await prisma.User.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const user = await prisma.User.create({
      data: { nome, sobrenome, email, senha } // ⚠️ ainda sem hash
    });

    res.json({ message: "Usuário criado", user });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const user = await prisma.User.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  if (user.senha !== senha)
    return res.status(401).json({ error: "Senha incorreta" });

  res.json({ message: "Login OK", user });
});


// Recuperação de senha simples (sem bcrypt, sem autenticação)
router.post('/forgot-password', async (req, res) => {
  try {
    console.log('🔐 Recuperar senha - Body:', req.body);

    const { email, code, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // --------------------------------------------
    // 1️⃣ ETAPA 1 → Gerar código de recuperação
    // --------------------------------------------
    if (!code && !newPassword) {
      const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Salva temporariamente na memória
      recoveryCodes.set(email.toLowerCase(), {
        code: recoveryCode,
        expires: Date.now() + 15 * 60 * 1000 // 15 minutos
      });

      console.log('🔐 Código gerado para:', email, recoveryCode);

      return res.json({
        message: 'Código gerado com sucesso (teste)',
        code: recoveryCode // retornando só para TESTE
      });
    }

    // --------------------------------------------
    // 2️⃣ ETAPA 2 → Validar código
    // --------------------------------------------
    const saved = recoveryCodes.get(email.toLowerCase());

    if (!saved) {
      return res.status(400).json({ error: 'Nenhum código foi gerado para este email' });
    }

    if (saved.expires < Date.now()) {
      recoveryCodes.delete(email.toLowerCase());
      return res.status(400).json({ error: 'O código expirou. Gere um novo.' });
    }

    if (saved.code !== code) {
      return res.status(400).json({ error: 'Código incorreto' });
    }

    // --------------------------------------------
    // 3️⃣ ETAPA 3 → Alterar senha (sem hash)
    // --------------------------------------------
    if (!newPassword) {
      return res.status(400).json({ error: 'Nova senha é obrigatória' });
    }

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { senha: newPassword } // sem bcrypt
    });

    recoveryCodes.delete(email.toLowerCase());

    return res.json({ message: 'Senha alterada com sucesso!' });

  } catch (error) {
    console.error('❌ Erro em /forgot-password:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});


// Listar usuários
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.User.findMany({
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

module.exports = router;
