import { useState, useEffect } from "react";
import { FaRedo, FaSignOutAlt, FaLightbulb, FaDownload, FaShare } from "react-icons/fa";
import ProductCard from "./ProductCard";
import FilterSort from "./FilterSort";
import ShareButton from "./ShareButton";
import { getExplanation } from "../services/api";
import { exportRecommendationsToPDF } from "../utils/exportPDF";

function RecommendationList({
  recommendations,
  preferences,
  onReset,
  onLogout,
  user,
}) {
  const [explanations, setExplanations] = useState({});
  const [loadingExplanations, setLoadingExplanations] = useState(false);
  const [filteredRecommendations, setFilteredRecommendations] = useState(recommendations);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('rating-desc');

  useEffect(() => {
    applyFiltersAndSort();
  }, [recommendations, filters, sortBy]);

  useEffect(() => {
    // Optionally fetch LLM explanations for each recommendation
    const fetchExplanations = async () => {
      setLoadingExplanations(true);
      const newExplanations = {};

      for (const product of recommendations) {
        try {
          const explanation = await getExplanation(preferences, product);
          newExplanations[product.id] = explanation;
        } catch (error) {
          console.error("Failed to get explanation for product:", product.id);
        }
      }

      setExplanations(newExplanations);
      setLoadingExplanations(false);
    };

    if (recommendations.length > 0) {
      fetchExplanations();
    }
  }, [recommendations, preferences]);

  // Apply filters and sorting to recommendations
  const applyFiltersAndSort = () => {
    let filtered = [...recommendations];

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(r => r.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(r => r.price <= filters.maxPrice);
    }
    if (filters.minRating) {
      filtered = filtered.filter(r => r.rating >= filters.minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'match-desc':
        filtered.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'distance-asc':
        filtered.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        break;
      default:
        break;
    }

    setFilteredRecommendations(filtered);
  };

  // Handle PDF export
  const handleExportPDF = () => {
    try {
      exportRecommendationsToPDF(filteredRecommendations, preferences, user);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header - Glassmorphism Style */}
        <div className="premium-card p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl heading-premium mb-3">
              Your Curated Collection
            </h1>
            <p className="text-body-premium max-w-xl">
              We've analyzed your preferences to bring you these exceptional matches.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 relative z-10">
            <button
              onClick={handleExportPDF}
              className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-black hover:shadow-lg text-sm"
            >
              <FaDownload className="text-xs" />
              <span>Export PDF</span>
            </button>

            <ShareButton recommendations={filteredRecommendations} customClass="bg-white border border-slate-200 text-slate-700 hover:border-slate-400 dark:bg-transparent dark:border-slate-700 dark:text-white" />

            <button
              onClick={onReset}
              className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:border-slate-400 dark:bg-transparent dark:border-slate-700 dark:text-white text-sm"
            >
              <FaRedo className="text-xs" />
              <span>Refine</span>
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 text-sm"
            >
              <FaSignOutAlt className="text-xs" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Preferences Summary - Accordion-like or Compact */}
        <div className="premium-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-6">
            Search Criteria
          </h3>
          {preferences.preferences && Array.isArray(preferences.preferences) ? (
            <div className="grid md:grid-cols-2 gap-6">
              {preferences.preferences.map((pref, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold">{index + 1}</span>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {pref.category}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400">Budget</div>
                    <div className="font-medium text-slate-900 dark:text-white">₹{pref.budget.toLocaleString('en-IN')}</div>

                    <div className="text-slate-500 dark:text-slate-400">Brands</div>
                    <div className="font-medium text-slate-900 dark:text-white truncate">{pref.brands.join(", ")}</div>

                    <div className="text-slate-500 dark:text-slate-400">Focus</div>
                    <div className="font-medium text-slate-900 dark:text-white">{pref.featurePreference}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <span className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Categories</span>
                <span className="font-semibold text-slate-900 dark:text-white">{preferences.interests?.join(", ")}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Budget</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{preferences.budget}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Brand Focus</span>
                <span className="font-semibold text-slate-900 dark:text-white">{preferences.brandPreference}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Feature Priority</span>
                <span className="font-semibold text-slate-900 dark:text-white">{preferences.featurePreference}</span>
              </div>
            </div>
          )}
        </div>

        {/* Filter and Sort Component */}
        <FilterSort
          onFilterChange={setFilters}
          onSortChange={setSortBy}
          showDistance={recommendations.some(r => r.location)}
        />

        {/* Recommendations Grid */}
        {filteredRecommendations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecommendations.map((product, index) => (
              <div key={product.id} className="space-y-4 group">
                <div className="h-full">
                  <ProductCard product={product} rank={index + 1} />
                </div>

                {/* LLM Explanation - Elegant styles */}
                {(explanations[product.id] || (loadingExplanations && !explanations[product.id])) && (
                  <div className={`
                    relative p-5 rounded-xl border transition-all duration-300
                    ${explanations[product.id]
                      ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 border-transparent'
                    }
                  `}>
                    {/* Connection Line */}
                    <div className="absolute -top-4 left-8 w-px h-4 bg-slate-200 dark:bg-slate-800"></div>

                    {explanations[product.id] ? (
                      <div className="flex gap-4">
                        <div className="mt-1 flex-shrink-0">
                          <FaLightbulb className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Why it's a match
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {explanations[product.id]}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-8 w-8"></div>
                        <div className="flex-1 space-y-3 py-1">
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                          <div className="space-y-2">
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="premium-card p-16 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">No Perfect Matches Found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              We couldn't find products matching your exact filters. Try adjusting your preferences or filters to see more results.
            </p>
            <button
              onClick={onReset}
              className="bg-slate-900 text-white dark:bg-white dark:text-black px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Update Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendationList;
