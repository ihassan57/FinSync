const express = require('express');
const { Pool } = require('pg');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

router.post('/', authMiddleware, async (req, res) => {
  const { category_name, type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO category (user_id, category_name, type) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, category_name, type]
    );
    res.status(201).json({ success: true, category: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM category WHERE user_id = $1', [req.userId]);
    res.json({ success: true, categories: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;