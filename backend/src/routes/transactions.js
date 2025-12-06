const express = require("express");
const prisma = require("../db");

const router = express.Router();

/* ============================================
   🔹 1. Buscar todas as transações de um usuário
   ============================================ */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return res.json({ transactions });
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return res.status(500).json({ error: "Erro ao buscar transações" });
  }
});

/* ============================================
   🔹 2. Criar nova transação
   ============================================ */
router.post("/", async (req, res) => {
  try {
    const { type, description, value, userId } = req.body;

    if (!userId || type === undefined || !description || value === undefined) {
      return res.status(400).json({
        error: "Campos obrigatórios: type, description, value e userId",
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: Number(type),
        description,
        value: Number(value),
        userId,
      },
    });

    return res.status(201).json({ transaction });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return res.status(500).json({ error: "Erro ao criar transação" });
  }
});

/* ============================================
   🔹 3. Deletar transação
   ============================================ */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return res.json({ message: "Transação deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return res.status(500).json({ error: "Erro ao deletar transação" });
  }
});

/* ============================================
   🔹 4. Calcular saldo
   ============================================ */
router.get("/balance", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    const balance = transactions.reduce((acc, t) => {
      return t.type === 1 ? acc + t.value : acc - t.value;
    }, 0);

    return res.json({ balance });
  } catch (error) {
    console.error("Erro ao calcular saldo:", error);
    return res.status(500).json({ error: "Erro ao calcular saldo" });
  }
});

module.exports = router;
