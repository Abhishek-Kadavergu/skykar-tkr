import firestoreService from '../services/firestoreService.js';

/**
 * Add product to favorites
 */
export const addToFavorites = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required' });
        }

        const result = await firestoreService.addToFavorites(userId, productId);

        res.status(200).json({
            message: 'Added to favorites',
            ...result
        });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Remove product from favorites
 */
export const removeFromFavorites = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required' });
        }

        const result = await firestoreService.removeFromFavorites(userId, productId);

        res.status(200).json({
            message: 'Removed from favorites',
            ...result
        });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get user favorites
 */
export const getFavorites = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const favorites = await firestoreService.getFavorites(userId);

        res.status(200).json({
            userId,
            favorites
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Track product view
 */
export const trackProductView = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required' });
        }

        await firestoreService.trackProductView(userId, productId);

        res.status(200).json({
            message: 'Product view tracked'
        });
    } catch (error) {
        console.error('Error tracking product view:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get user stats
 */
export const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const stats = await firestoreService.getStats(userId);
        const favorites = await firestoreService.getFavorites(userId);

        res.status(200).json({
            userId,
            stats: {
                ...stats,
                favoritesCount: favorites.length
            }
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get user profile with all data
 */
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await firestoreService.getUser(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
