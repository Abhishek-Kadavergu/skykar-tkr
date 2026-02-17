import express from 'express';
import { generateRecommendations, getRecommendations } from '../controllers/recommendationController.js';

const router = express.Router();

// POST /api/recommendations/generate
// Body: { userId: "..." }
router.post('/generate', generateRecommendations);

// GET /api/recommendations/:userId
router.get('/:userId', getRecommendations);

export default router;
