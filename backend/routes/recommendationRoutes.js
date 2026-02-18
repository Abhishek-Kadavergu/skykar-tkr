import express from 'express';
import { generateRecommendations, getRecommendations, getHistory } from '../controllers/recommendationController.js';

const router = express.Router();

// POST /api/recommendations/generate
// Body: { userId: "..." }
router.post('/generate', generateRecommendations);

// GET /api/recommendations/:userId
router.get('/:userId', getRecommendations);

// GET /api/recommendations/history/:userId
router.get('/history/:userId', getHistory);

export default router;
