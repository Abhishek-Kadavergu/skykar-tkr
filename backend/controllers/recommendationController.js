import UserRecommendation from '../models/userRecommendationModel.js';
import UserPreference from '../models/userPreferenceModel.js';
import products from '../data/products.js';

export const createRecommendations = async (userId) => {
    // Fetch user preferences
    const userPrefDoc = await UserPreference.findOne({ user: userId });

    if (!userPrefDoc || !userPrefDoc.preferences || userPrefDoc.preferences.length === 0) {
        throw new Error('No preferences found for this user');
    }

    // Use the latest preference set
    const latestPref = userPrefDoc.preferences[userPrefDoc.preferences.length - 1];

    if (!latestPref) {
        throw new Error('Invalid preference data');
    }

    const { budget, brandPreference, featurePreference, interests = [], category } = latestPref;

    // Ensure interests is an array (Normalize input)
    let userInterests = [];
    if (Array.isArray(interests) && interests.length > 0) {
        userInterests = interests;
    } else if (category) {
        // Fallback: If "category" string is provided, use it as the interest
        userInterests = [category];
    } else if (typeof interests === 'string') {
        // Fallback: If "interests" is a string
        userInterests = [interests];
    }

    // Filter out empty strings or nulls
    userInterests = userInterests.filter(i => i);

    console.log(`Generating recommendations for user ${userId}`);
    console.log(`Preferences - Budget: ${budget}, Brand: ${brandPreference}, Feature: ${featurePreference}, Interests: ${userInterests.join(', ')}`);

    // STRICT FILTERING: If user has selected interests/categories, ONLY show products from those categories.
    let candidateProducts = products;
    if (userInterests.length > 0) {
        candidateProducts = products.filter(product =>
            product.category && userInterests.some(interest => interest.toLowerCase() === product.category.toLowerCase())
        );
        console.log(`Filtered products by category. Candidates: ${candidateProducts.length}`);
    } else {
        console.log(`No specific categories selected. Using all ${products.length} products.`);
    }

    // Score products
    const scoredProducts = candidateProducts.map(product => {
        let score = 0;
        let reasons = [];

        // 1. Category Match (Base Score) - 100 points
        // Since we already filtered, this is guaranteed for the candidates if interests were provided.
        // We add this so these products rank way higher than any potential "loose matches" if we ever relax the filter.
        if (userInterests.some(interest => interest && product.category && interest.toLowerCase() === product.category.toLowerCase())) {
            score += 100;
            reasons.push(`Matches interest in ${product.category}`);
        }

        // 2. Brand Preference (High Priority) - 50 points
        if (brandPreference && brandPreference !== 'Any' && product.brand.toLowerCase() === brandPreference.toLowerCase()) {
            score += 50;
            reasons.push(`Preferred brand: ${brandPreference}`);
        }

        // 3. Feature Preference (Medium Priority) - 30 points
        if (featurePreference && product.featureType && product.featureType.toLowerCase() === featurePreference.toLowerCase()) {
            score += 30;
            reasons.push(`Matched feature: ${featurePreference}`);
        }

        // 4. Budget Check (Critical Constraint) - 40 points
        // We penalize significantly if over budget, rather than just not adding points.
        if (budget) {
            if (product.price <= budget) {
                score += 40;
                reasons.push('Fits within budget');
            } else if (product.price <= budget * 1.1) {
                // Slightly above (10%)
                score += 20;
                reasons.push('Slightly above budget');
            } else {
                // Way over budget - penalty? 
                // For now, just no points.
            }
        }

        // 5. Rating Boost (Tie-breaker) - up to 10 points
        if (product.rating) {
            score += product.rating * 2;
        }

        return {
            product,
            matchScore: score,
            matchReasons: reasons
        };
    });

    // Sort by score descending
    const relevantProducts = scoredProducts
        .filter(item => item.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);

    // Take top 10
    const topRecommendations = relevantProducts.slice(0, 10);

    console.log(`Top ${topRecommendations.length} recommendations generated.`);

    // Save to DB
    let recommendationDoc = await UserRecommendation.findOne({ user: userId });

    if (recommendationDoc) {
        recommendationDoc.recommendations = topRecommendations;
        recommendationDoc.generatedAt = Date.now();
    } else {
        recommendationDoc = new UserRecommendation({
            user: userId,
            recommendations: topRecommendations
        });
    }

    await recommendationDoc.save();

    return topRecommendations;
};

export const generateRecommendations = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const topRecommendations = await createRecommendations(userId);

        res.status(200).json({
            message: 'Recommendations generated successfully',
            count: topRecommendations.length,
            recommendations: topRecommendations
        });

    } catch (error) {
        console.error('Error generating recommendations:', error);
        // Handle specific errors for 404
        if (error.message.includes('No preferences found') || error.message.includes('Invalid preference data')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const recommendationDoc = await UserRecommendation.findOne({ user: userId });

        if (!recommendationDoc) {
            return res.status(404).json({ message: 'No recommendations found for this user' });
        }

        res.status(200).json(recommendationDoc);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
