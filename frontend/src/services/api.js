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

export default {
  getExplanation
};
