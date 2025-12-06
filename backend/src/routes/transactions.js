const express = require('express');
const prisma = require('../db');

const router = express.Router();

// Buscar todas as transações do usuário
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId; // Recebe via query

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

// Criar nova transação
router.post('/', async (req, res) => {
  try {
    const { type, description, value, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    if (type === undefined || !description || value === undefined) {
      return res.status(400).json({ error: 'Type, description, value e userId são obrigatórios' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: Number(type),
        description,
        value: Number(value),
        userId
      }
    });

    res.status(201).json({ transaction });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// Deletar transação
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    await prisma.transaction.delete({ where: { id } });

    res.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
});

// Calcular saldo
router.get('/balance', async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId }
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
