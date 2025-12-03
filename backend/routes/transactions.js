const express = require('express');
const router = express.Router();

const transactions = [
  { id: '1', type: 0, description: 'Compra no mercado', value: 200.5 },
  { id: '2', type: 1, description: 'Salário', value: 3500.0 },
];

// GET /transactions - Fetch all transactions
router.get('/', (req, res) => {
  res.json(transactions);
});

// POST /transactions - Add a new transaction
router.post('/', (req, res) => {
  const { type, description, value } = req.body;
  const newTransaction = {
    id: (transactions.length + 1).toString(),
    type,
    description,
    value,
  };
  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

module.exports = router;