/**
 * Local Recommendation Engine
 * Runs entirely in the frontend without external dependencies
 * 
 * Algorithm:
 * 1. Filter by category
 * 2. Calculate scores based on:
 *    - Price match (40%)
 *    - Feature preference (30%)
 *    - Brand preference (20%)
 *    - Rating (10%)
 * 3. Sort by final score
 * 4. Return top 3 items
 */

export function getRecommendations(userPreferences, products) {
  const { interests, budget, brandPreference, featurePreference } = userPreferences;

  // Step 1: Filter by selected categories
  const filteredProducts = products.filter(product => 
    interests.includes(product.category)
  );

  // Step 2: Calculate scores for each product
  const scoredProducts = filteredProducts.map(product => {
    // Price Score: How close is the product price to the user's budget?
    // Closer to budget = higher score
    const priceScore = 1 - Math.min(Math.abs(product.price - budget) / budget, 1);

    // Brand Score: Does it match the preferred brand?
    const brandScore = brandPreference.toLowerCase() === product.brand.toLowerCase() ? 1 : 0;

    // Feature Score: Does the feature type match preference?
    const featureScore = featurePreference === product.featureType 
      ? product.featureScore / 10 
      : 0.3;

    // Rating Score: Normalize rating to 0-1 scale
    const ratingScore = product.rating / 5;

    // Calculate final weighted score
    const finalScore = 
      (priceScore * 0.4) +
      (featureScore * 0.3) +
      (brandScore * 0.2) +
      (ratingScore * 0.1);

    return {
      ...product,
      matchScore: Math.round(finalScore * 100), // Convert to percentage
      breakdown: {
        priceScore: Math.round(priceScore * 100),
        featureScore: Math.round(featureScore * 100),
        brandScore: Math.round(brandScore * 100),
        ratingScore: Math.round(ratingScore * 100)
      }
    };
  });

  // Step 3: Sort by final score (descending)
  scoredProducts.sort((a, b) => b.matchScore - a.matchScore);

  // Step 4: Return top 3 recommendations
  return scoredProducts.slice(0, 3);
}

export default getRecommendations;
