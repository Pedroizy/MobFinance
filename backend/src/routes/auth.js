const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../db');

const router = express.Router();

// Armazenamento temporário de códigos de recuperação (em produção use Redis ou banco)
const recoveryCodes = new Map();

// Cadastro
router.post('/signup', async (req, res) => {
  try {
    console.log('📝 Cadastro - Body recebido:', req.body);
    
    const { nome, sobrenome, email, senha } = req.body;

    if (!nome || !sobrenome || !email || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: {
        nome,
        sobrenome,
        email: email.toLowerCase(),
        senha: hashedPassword,
      }
    });

    console.log('✅ Usuário criado:', user.id);

    // Sem JWT → retorna apenas o usuário
    res.status(201).json({
      user: {
        id: user.id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔑 Login - Body recebido:', { email: req.body.email });
    
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    console.log('✅ Login bem sucedido:', user.email);

    // Sem JWT → retorna apenas o usuário
    res.json({
      user: {
        id: user.id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Recuperação de senha
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

    // Etapa 1 → gerar código
    if (!code && !newPassword) {
      const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

      recoveryCodes.set(email.toLowerCase(), {
        code: recoveryCode,
        expires: Date.now() + 15 * 60 * 1000
      });

      console.log('🔐 Código gerado para:', email, recoveryCode);

      return res.json({
        message: 'Código enviado',
        code: recoveryCode // só para testes
      });
    }

    // Etapa 2 → validar código e resetar senha
    if (code && newPassword) {
      const stored = recoveryCodes.get(email.toLowerCase());

      if (!stored) {
        return res.status(400).json({ error: 'Código não encontrado' });
      }

      if (Date.now() > stored.expires) {
        recoveryCodes.delete(email.toLowerCase());
        return res.status(400).json({ error: 'Código expirado' });
      }

      if (stored.code !== code) {
        return res.status(400).json({ error: 'Código inválido' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: { senha: hashedPassword }
      });

      recoveryCodes.delete(email.toLowerCase());

      return res.json({ message: 'Senha redefinida com sucesso' });
    }

    return res.status(400).json({ error: 'Requisição inválida' });

  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    res.status(500).json({ error: 'Erro ao recuperar senha' });
  }
});

// Listar usuários
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
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
