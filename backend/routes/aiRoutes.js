import express from 'express';
import {
    chat,
    processSearch,
    getConversationHistory,
    clearConversation
} from '../controllers/aiController.js';

const router = express.Router();

// AI Chat
router.post('/chat', chat);

// Natural Language Search
router.post('/search', processSearch);

// Conversation Management
router.get('/conversation/:userId', getConversationHistory);
router.post('/conversation/clear', clearConversation);

export default router;
