const express = require('express');
const { Pool } = require('pg');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// Create a budget
router.post('/', authMiddleware, async (req, res) => {
  const { category_id, limit_amount, period, start_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO budget (user_id, category_id, limit_amount, period, start_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, category_id, limit_amount, period, start_date]
    );
    res.status(201).json({ success: true, budget: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// List budgets with spent-so-far this month vs limit
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, c.category_name,
        COALESCE((
          SELECT SUM(-t.amount) FROM "transaction" t
          JOIN account a ON t.account_id = a.account_id
          WHERE t.category_id = b.category_id
            AND a.user_id = b.user_id
            AND t.amount < 0
            AND t.date >= date_trunc('month', now())
        ), 0) AS spent
       FROM budget b
       JOIN category c ON b.category_id = c.category_id
       WHERE b.user_id = $1`,
      [req.userId]
    );
    res.json({ success: true, budgets: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;