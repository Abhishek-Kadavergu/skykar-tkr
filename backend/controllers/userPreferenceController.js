import UserPreference from '../models/userPreferenceModel.js';
import { createRecommendations } from './recommendationController.js';

export const saveUserPreferences = async (req, res) => {
    try {
        const { uid, name, email, preferences } = req.body;

        // Validate input
        if (!uid || !name || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if preferences already exist for this user
        let userPref = await UserPreference.findOne({ user: uid });

        if (userPref) {
            // Update existing preferences
            userPref.name = name;
            userPref.email = email;
            userPref.preferences = preferences;
            // We might want to update lastRecommendation too if provided, but for now just preferences
        } else {
            // Create new preference document
            userPref = new UserPreference({
                user: uid,
                name,
                email,
                preferences
            });
        }

        const savedPref = await userPref.save();

        // Trigger recommendation generation
        // We await it to ensure it completes, or handle error if it fails
        try {
            await createRecommendations(uid);
            console.log(`Recommendations generated for user ${uid}`);
        } catch (recError) {
            console.error(`Failed to generate recommendations for user ${uid}:`, recError);
            // We don't fail the preference save if recommendation fails, but we log it
        }

        res.status(201).json(savedPref);
    } catch (error) {
        console.error('Error saving user preferences:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
