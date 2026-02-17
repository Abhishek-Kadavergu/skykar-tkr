import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import explainRouter from './routes/explain.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/explain', explainRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AalayaX API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
