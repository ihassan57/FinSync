const express = require('express');
const { Pool } = require('pg');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a new account
router.post('/', authMiddleware, async (req, res) => {
  const { account_name, account_type, opening_balance } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO account (user_id, account_name, account_type, opening_balance, current_balance, balance_source)
       VALUES ($1, $2, $3, $4, $4, 'manual') RETURNING *`,
      [req.userId, account_name, account_type, opening_balance || 0]
    );
    res.status(201).json({ success: true, account: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// List all accounts for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM account WHERE user_id = $1', [req.userId]);
    res.json({ success: true, accounts: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update an account
router.put('/:id', authMiddleware, async (req, res) => {
  const { account_name, account_type } = req.body;
  try {
    const result = await pool.query(
      `UPDATE account SET account_name = COALESCE($1, account_name), account_type = COALESCE($2, account_type)
       WHERE account_id = $3 AND user_id = $4 RETURNING *`,
      [account_name, account_type, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Account not found' });
    res.json({ success: true, account: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete an account
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM account WHERE account_id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Account not found' });
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;