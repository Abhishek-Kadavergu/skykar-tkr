/**
 * Local Recommendation Engine
 * Runs entirely in the frontend without external dependencies
 *
 * Algorithm:
 * 1. For each preference category, filter products
 * 2. Calculate scores based on:
 *    - Price match (40% * budgetImportance)
 *    - Feature preference (30%)
 *    - Brand preference (20%)
 *    - Rating (10% * ratingImportance)
 * 3. Sort by final score
 * 4. Return top 10 items across all preferences
 */

export function getRecommendations(userData, products) {
  // Handle both old and new data structures
  let preferencesArray = [];

  if (userData.preferences && Array.isArray(userData.preferences)) {
    // New structure with multiple preferences
    preferencesArray = userData.preferences;
  } else {
    // Old structure - convert to new format
    preferencesArray = [
      {
        category: userData.interests?.[0] || "Tech",
        budget: userData.budget || 5000,
        brands: userData.brandPreference ? [userData.brandPreference] : [],
        featurePreference: userData.featurePreference || "Performance",
        ratingImportance: 4,
        budgetImportance: 3,
      },
    ];
  }

  // Get recommendations for each preference
  const allScoredProducts = [];
  const productIds = new Set();

  preferencesArray.forEach((preference, prefIndex) => {
    // Filter products by category
    const filteredProducts = products.filter(
      (product) => product.category === preference.category,
    );

    // Calculate scores for each product
    const scoredProducts = filteredProducts
      .map((product) => {
        // Only calculate if we haven't already scored this product
        if (productIds.has(product.id)) {
          return null;
        }

        // Price Score: How close is the product price to the user's budget?
        const priceScore =
          1 -
          Math.min(
            Math.abs(product.price - preference.budget) / preference.budget,
            1,
          );

        // Brand Score: Does it match any of the preferred brands?
        const brandScore =
          preference.brands && preference.brands.length > 0
            ? preference.brands.some(
                (b) => b.toLowerCase() === product.brand.toLowerCase(),
              )
              ? 1
              : 0
            : 0;

        // Feature Score: Does the feature type match preference?
        const featureScore =
          preference.featurePreference === product.featureType
            ? product.featureScore / 10
            : 0.3;

        // Rating Score: Normalize rating to 0-1 scale
        const ratingScore = product.rating / 5;

        // Calculate final weighted score using importance weights
        const budgetWeight = preference.budgetImportance / 5; // Normalize to 0-1
        const ratingWeight = preference.ratingImportance / 5; // Normalize to 0-1

        const finalScore =
          priceScore * 0.4 * budgetWeight +
          featureScore * 0.3 +
          brandScore * 0.2 +
          ratingScore * 0.1 * ratingWeight;

        productIds.add(product.id);

        return {
          ...product,
          preferenceIndex: prefIndex,
          preferenceCategory: preference.category,
          matchScore: Math.round(finalScore * 100), // Convert to percentage
          breakdown: {
            priceScore: Math.round(priceScore * 100),
            featureScore: Math.round(featureScore * 100),
            brandScore: Math.round(brandScore * 100),
            ratingScore: Math.round(ratingScore * 100),
          },
        };
      })
      .filter((p) => p !== null);

    allScoredProducts.push(...scoredProducts);
  });

  // Sort by final score (descending)
  allScoredProducts.sort((a, b) => b.matchScore - a.matchScore);

  // Return top 10 recommendations across all preferences
  return allScoredProducts.slice(0, 10);
}

export default getRecommendations;
