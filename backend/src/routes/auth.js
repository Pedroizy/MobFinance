const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
      console.log('❌ Campos faltando:', { nome, sobrenome, email, senha: senha ? '***' : undefined });
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (senha.length < 6) {
      console.log('❌ Senha muito curta:', senha.length);
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      console.log('❌ Email já existe:', email);
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

    console.log('✅ Usuário criado:', user.id, user.email);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
      },
      token
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔑 Login - Body recebido:', { email: req.body.email, senha: '***' });
    
    const { email, senha } = req.body;

    if (!email || !senha) {
      console.log('❌ Email ou senha faltando');
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
      console.log('❌ Senha incorreta para:', email);
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    console.log('✅ Login bem sucedido:', user.email);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Recuperar senha - Etapa 1: Gerar e enviar código
router.post('/forgot-password', async (req, res) => {
  try {
    console.log('🔐 Recuperar senha - Body recebido:', req.body);
    
    const { email, code, newPassword } = req.body;

    if (!email) {
      console.log('❌ Email não fornecido');
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      console.log('⚠️ Email não encontrado:', email);
      // Por segurança, retorna sucesso mesmo se não existir
      // Em produção, isso evita que descubram emails válidos
      const fakeCode = Math.floor(100000 + Math.random() * 900000).toString();
      return res.json({
        message: 'Se o email existir, um código foi enviado',
        code: fakeCode // REMOVER EM PRODUÇÃO
      });
    }

    // Se não tem código, gera um novo
    if (!code && !newPassword) {
      // Gera código de 6 dígitos
      const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Armazena com expiração de 15 minutos
      recoveryCodes.set(email.toLowerCase(), {
        code: recoveryCode,
        expires: Date.now() + 15 * 60 * 1000
      });

      console.log('🔐 Código de recuperação gerado para:', email, '-', recoveryCode);

      // Em produção, enviar por email. Por enquanto retorna no response
      return res.json({
        message: 'Código enviado',
        code: recoveryCode // REMOVER EM PRODUÇÃO
      });
    }

    // Se tem código e nova senha, valida e reseta
    if (code && newPassword) {
      const stored = recoveryCodes.get(email.toLowerCase());

      if (!stored) {
        return res.status(400).json({ error: 'Código não encontrado. Solicite um novo código' });
      }

      if (Date.now() > stored.expires) {
        recoveryCodes.delete(email.toLowerCase());
        return res.status(400).json({ error: 'Código expirado. Solicite um novo código' });
      }

      if (stored.code !== code) {
        return res.status(400).json({ error: 'Código inválido' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
      }

      // Atualiza a senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: { senha: hashedPassword }
      });

      // Remove o código usado
      recoveryCodes.delete(email.toLowerCase());

      console.log('✅ Senha redefinida para:', email);

      return res.json({ message: 'Senha redefinida com sucesso' });
    }

    return res.status(400).json({ error: 'Requisição inválida' });
  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    res.status(500).json({ error: 'Erro ao recuperar senha' });
  }
});

module.exports = router;
