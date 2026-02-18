import express from 'express';
import {
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    trackProductView,
    getUserStats,
    getUserProfile
} from '../controllers/userController.js';

const router = express.Router();

// Favorites
router.post('/favorites/add', addToFavorites);
router.post('/favorites/remove', removeFromFavorites);
router.get('/favorites/:userId', getFavorites);

// Tracking
router.post('/track/view', trackProductView);

// Stats
router.get('/stats/:userId', getUserStats);

// Profile
router.get('/profile/:userId', getUserProfile);

export default router;
