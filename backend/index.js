require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('FinSync API running');
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const authMiddleware = require('./middleware/auth');

app.get('/protected-test', authMiddleware, (req, res) => {
  res.json({ success: true, message: `You are user #${req.userId}` });
});

const accountRoutes = require('./routes/accounts');
app.use('/accounts', accountRoutes);

const transactionRoutes = require('./routes/transactions');
app.use('/transactions', transactionRoutes);

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});