const express = require('express');
const { Pool } = require('pg');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a transaction
router.post('/', authMiddleware, async (req, res) => {
  const { account_id, category_id, amount, type, merchant, description } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Confirm this account belongs to the logged-in user
    const accountCheck = await client.query(
      'SELECT * FROM account WHERE account_id = $1 AND user_id = $2',
      [account_id, req.userId]
    );
    if (accountCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    const signedAmount = type === 'income' ? Math.abs(amount) : -Math.abs(amount);

    const txResult = await client.query(
      `INSERT INTO "transaction" (account_id, category_id, amount, merchant, description, source, review_status, is_categorized_by_ai)
       VALUES ($1, $2, $3, $4, $5, 'manual', 'confirmed', false) RETURNING *`,
      [account_id, category_id || null, signedAmount, merchant, description]
    );

    await client.query(
      'UPDATE account SET current_balance = current_balance + $1 WHERE account_id = $2',
      [signedAmount, account_id]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, transaction: txResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// List transactions (optionally filtered by account_id)
router.get('/', authMiddleware, async (req, res) => {
  const { account_id } = req.query;
  try {
    let query = `SELECT t.* FROM "transaction" t
                 JOIN account a ON t.account_id = a.account_id
                 WHERE a.user_id = $1`;
    const params = [req.userId];
    if (account_id) {
      query += ' AND t.account_id = $2';
      params.push(account_id);
    }
    query += ' ORDER BY t.date DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, transactions: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete a transaction (and reverse its effect on the balance)
router.delete('/:id', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const txResult = await client.query(
      `SELECT t.* FROM "transaction" t JOIN account a ON t.account_id = a.account_id
       WHERE t.transaction_id = $1 AND a.user_id = $2`,
      [req.params.id, req.userId]
    );
    if (txResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    const tx = txResult.rows[0];
    await client.query('UPDATE account SET current_balance = current_balance - $1 WHERE account_id = $2', [tx.amount, tx.account_id]);
    await client.query('DELETE FROM "transaction" WHERE transaction_id = $1', [req.params.id]);
    await client.query('COMMIT');
    res.json({ success: true, message: 'Transaction deleted and balance reversed' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;