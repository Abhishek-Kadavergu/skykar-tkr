import firestoreService from '../services/firestoreService.js';
import { createRecommendations } from './recommendationController.js';

export const saveUserPreferences = async (req, res) => {
    try {
        const { uid, name, email, displayName, photoURL, preferences } = req.body;

        // Validate input
        if (!uid) {
            return res.status(400).json({ message: 'User ID (uid) is required' });
        }

        // Ensure user document exists
        let user = await firestoreService.getUser(uid);
        
        if (!user) {
            // Create new user
            await firestoreService.createUser(uid, {
                name: name || '',
                email: email || '',
                displayName: displayName || name || '',
                photoURL: photoURL || ''
            });
        }

        // Update preferences
        if (preferences && Array.isArray(preferences)) {
            await firestoreService.updatePreferences(uid, preferences);
        }

        // Trigger recommendation generation
        try {
            await createRecommendations(uid);
            console.log(`Recommendations generated for user ${uid}`);
        } catch (recError) {
            console.error(`Failed to generate recommendations for user ${uid}:`, recError);
            // Don't fail the preference save if recommendation generation fails
        }

        // Get updated user data
        const updatedUser = await firestoreService.getUser(uid);

        res.status(201).json({
            message: 'Preferences saved successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error saving user preferences:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserPreferences = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const preferences = await firestoreService.getPreferences(userId);

        res.status(200).json({
            userId,
            preferences
        });
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
