import express from 'express';
import geminiService from '../services/geminiService.js';

const router = express.Router();

/**
 * POST /api/explain
 * Generate AI explanation for why a product matches user preferences
 * Now uses real Gemini AI instead of mock data
 */
router.post('/', async (req, res) => {
  try {
    const { preferences, product } = req.body;

    if (!preferences || !product) {
      return res.status(400).json({ error: 'Missing preferences or product data' });
    }

    // Check if Gemini is available
    if (!geminiService.isAvailable()) {
      // Fallback to mock explanation
      const explanation = generateMockExplanation(preferences, product);
      return res.json({ 
        explanation,
        isAI: false,
        message: 'Using fallback explanation. Configure GEMINI_API_KEY for AI-powered explanations.'
      });
    }

    // Generate AI explanation
    const explanation = await geminiService.explainRecommendation(product, preferences);

    res.json({ 
      explanation,
      isAI: true
    });
  } catch (error) {
    console.error('Error generating explanation:', error);
    
    // Fallback to mock explanation on error
    const explanation = generateMockExplanation(req.body.preferences, req.body.product);
    res.json({ 
      explanation,
      isAI: false,
      message: 'AI service error. Using fallback explanation.'
    });
  }
});

/**
 * Fallback mock explanation (used when Gemini is unavailable)
 */
function generateMockExplanation(preferences, product) {
  const { budget, brands = [], featurePreference, category } = preferences;

  const reasons = [];

  // Category match
  if (product.category === category) {
    reasons.push(`matches your interest in ${category}`);
  }

  // Price match
  const priceDiff = Math.abs(product.price - budget);
  if (priceDiff < budget * 0.2) {
    reasons.push(`the price of ₹${product.price} is within your budget of ₹${budget}`);
  } else if (product.price < budget) {
    reasons.push(`it's priced at ₹${product.price}, well under your budget of ₹${budget}`);
  } else {
    reasons.push(`while slightly above your ₹${budget} budget at ₹${product.price}, it offers excellent value`);
  }

  // Brand match
  if (brands && brands.length > 0 && brands.includes(product.brand)) {
    reasons.push(`it's from ${product.brand}, one of your preferred brands`);
  }

  // Feature match
  if (featurePreference && product.featureType === featurePreference) {
    reasons.push(`it excels in ${featurePreference}, which you prioritize`);
  }

  // Rating
  if (product.rating >= 4) {
    reasons.push(`it has a high rating of ${product.rating}/5`);
  }

  const explanation = `${product.name} is recommended because ${reasons.slice(0, 3).join(', and ')}.`;

  return explanation;
}

export default router;
