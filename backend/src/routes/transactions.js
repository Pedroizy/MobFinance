const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const prisma = require('../db');

const router = express.Router();

// Buscar todas as transações do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

// Criar nova transação
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, description, value } = req.body;

    console.log('💸 Criar transação - Body recebido:', { type, description, value });

    if (type === undefined || !description || value === undefined) {
      return res.status(400).json({ error: 'Type, description e value são obrigatórios' });
    }

    if (type !== 0 && type !== 1) {
      return res.status(400).json({ error: 'Type deve ser 0 (despesa) ou 1 (receita)' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: parseInt(type),
        description,
        value: parseFloat(value),
        userId: req.user.id
      }
    });

    console.log('✅ Transação criada:', transaction.id);
    res.status(201).json({ transaction });
  } catch (error) {
    console.error('❌ Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// Deletar transação
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    await prisma.transaction.delete({
      where: { id }
    });

    res.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
});

// Calcular saldo
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id }
    });

    const balance = transactions.reduce((acc, t) => {
      return t.type === 1 ? acc + t.value : acc - t.value;
    }, 0);

    res.json({ balance });
  } catch (error) {
    console.error('Erro ao calcular saldo:', error);
    res.status(500).json({ error: 'Erro ao calcular saldo' });
  }
});

module.exports = router;
