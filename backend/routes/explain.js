import express from 'express';

const router = express.Router();

/**
 * POST /api/explain
 * Generate explanation for why a product matches user preferences
 * 
 * Input: { preferences, product }
 * Output: { explanation: string }
 * 
 * Note: This currently returns mock explanations.
 * In production, you can integrate with OpenAI, Anthropic, or other LLM providers.
 */
router.post('/', async (req, res) => {
  try {
    const { preferences, product } = req.body;

    if (!preferences || !product) {
      return res.status(400).json({ error: 'Missing preferences or product data' });
    }

    // Generate mock explanation based on preferences and product
    const explanation = generateExplanation(preferences, product);

    res.json({ explanation });
  } catch (error) {
    console.error('Error generating explanation:', error);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

/**
 * Generate a mock explanation
 * TODO: Replace with actual LLM integration (OpenAI, Anthropic, etc.)
 */
function generateExplanation(preferences, product) {
  const { budget, brandPreference, featurePreference, interests } = preferences;
  
  const reasons = [];

  // Price match reason
  const priceDiff = Math.abs(product.price - budget);
  if (priceDiff < budget * 0.2) {
    reasons.push(`the price of $${product.price} is within your budget of $${budget}`);
  } else if (product.price < budget) {
    reasons.push(`it's priced at $${product.price}, well under your budget of $${budget}`);
  } else {
    reasons.push(`while slightly above your $${budget} budget at $${product.price}, it offers excellent value`);
  }

  // Brand match reason
  if (brandPreference && brandPreference !== 'Any' && product.brand.toLowerCase() === brandPreference.toLowerCase()) {
    reasons.push(`it's from ${product.brand}, your preferred brand`);
  } else {
    reasons.push(`${product.brand} is known for quality in the ${product.category.toLowerCase()} category`);
  }

  // Feature match reason
  if (product.featureType === featurePreference) {
    reasons.push(`it excels in ${featurePreference} (${product.featureScore}/10 score), which is your top priority`);
  } else {
    reasons.push(`it offers strong ${product.featureType} features (${product.featureScore}/10 score)`);
  }

  // Rating reason
  if (product.rating >= 4.5) {
    reasons.push(`it has an excellent ${product.rating}/5 star rating from users`);
  } else if (product.rating >= 4.0) {
    reasons.push(`it has a solid ${product.rating}/5 star rating`);
  }

  // Construct final explanation
  const explanation = `The ${product.name} is recommended because ${reasons.join(', ')}. With a ${product.matchScore}% compatibility score, this product aligns well with your ${interests.join(', ')} interests and preferences.`;

  return explanation;
}

export default router;
