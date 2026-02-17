// API service for backend communication
// Handles LLM explanation generation (optional feature)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get LLM explanation for a recommended product
 * This is OPTIONAL - recommendations work without it
 */
export const getExplanation = async (preferences, product) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preferences, product }),
    });

    if (!response.ok) {
      throw new Error('Failed to get explanation');
    }

    const data = await response.json();
    return data.explanation;
  } catch (error) {
    console.error('Error getting explanation:', error);
    // Return fallback explanation if backend fails
    return `This ${product.name} matches your preferences with a ${product.matchScore}% compatibility score based on your budget of $${preferences.budget} and preference for ${preferences.featurePreference} features.`;
  }
};

export const saveUserPreferences = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user-preferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to save preferences");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
};

export const getRecommendations = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    const data = await response.json();

    // Transform backend data to match frontend component expectations
    return data.recommendations.map(rec => ({
      ...rec.product, // Flatten product details
      matchScore: rec.matchScore > 100 ? 100 : rec.matchScore, // Cap at 100 for % display
      matchReasons: rec.matchReasons,
      // Add breakdown to prevent UI crash (mock values or derived)
      breakdown: {
        priceScore: rec.matchReasons.includes('Fits within budget') ? 100 : 50,
        featureScore: rec.matchReasons.some(r => r.includes('Matched feature')) ? 100 : 50,
        brandScore: rec.matchReasons.some(r => r.includes('Preferred brand')) ? 100 : 50,
        ratingScore: Math.round((rec.product.rating / 5) * 100)
      }
    }));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

export default {
  getExplanation,
  saveUserPreferences,
  getRecommendations
};
