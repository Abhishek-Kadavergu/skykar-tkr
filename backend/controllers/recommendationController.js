import firestoreService from '../services/firestoreService.js';
import dataSourceManager from '../services/dataSourceManager.js';
import products from '../data/products.js';

export const createRecommendations = async (userId, location = null) => {
    // Fetch user preferences
    const user = await firestoreService.getUser(userId);

    if (!user || !user.preferences || user.preferences.length === 0) {
        throw new Error('No preferences found for this user');
    }

    console.log(`🎯 Generating recommendations for ${user.preferences.length} preferences`);

    // Use Data Source Manager to get recommendations from multiple APIs
    const allRecommendations = await dataSourceManager.getRecommendations({
        userId,
        preferences: user.preferences,
        location
    });

    console.log(`✅ Generated ${allRecommendations.length} recommendations from multiple sources`);

    // Save to Firestore
    if (allRecommendations.length > 0) {
        await firestoreService.saveRecommendation(userId, {
            category: 'Multiple',
            products: allRecommendations
        });

        // Update stats
        const categories = [...new Set(user.preferences.map(p => p.category))];
        await firestoreService.updateStats(userId, {
            totalSearches: 1,
            categoriesExplored: categories
        });
    }

    return allRecommendations;
};

export const generateRecommendations = async (req, res) => {
    try {
        const { userId, location } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const recommendations = await createRecommendations(userId, location);

        res.status(200).json({
            message: 'Recommendations generated successfully',
            count: recommendations.length,
            recommendations: recommendations
        });

    } catch (error) {
        console.error('Error generating recommendations:', error);
        if (error.message.includes('No preferences found') || error.message.includes('Invalid preference data')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;
        const location = req.query.location ? JSON.parse(req.query.location) : null;

        console.log('📍 Location received in getRecommendations:', location ? `${location.lat}, ${location.lng}` : 'No location');

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Always generate fresh recommendations (don't use cached history)
        // This ensures location-based searches work every time
        try {
            const recommendations = await createRecommendations(userId, location);
            return res.status(200).json({
                userId,
                recommendations: recommendations || [],
                count: recommendations.length
            });
        } catch (error) {
            console.error('Could not generate recommendations:', error.message);
            return res.status(200).json({
                userId,
                recommendations: [],
                message: 'No recommendations yet. Please set your preferences first.'
            });
        }

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const history = await firestoreService.getRecommendationHistory(userId);

        res.status(200).json({
            userId,
            history: history || [],
            count: history?.length || 0
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
