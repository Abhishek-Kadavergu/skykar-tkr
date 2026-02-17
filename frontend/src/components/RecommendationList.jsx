import { useState, useEffect } from "react";
import { FaRedo, FaSignOutAlt, FaLightbulb } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { getExplanation } from "../services/api";

function RecommendationList({
  recommendations,
  preferences,
  onReset,
  onLogout,
  user,
}) {
  const [explanations, setExplanations] = useState({});
  const [loadingExplanations, setLoadingExplanations] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Your Personalized Recommendations
              </h1>
              <p className="text-slate-600">
                Based on your preferences, here are the top products we found
                for you
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-slate-700 rounded-md hover:bg-gray-200 transition-all font-semibold"
              >
                <FaRedo />
                New Search
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-all font-semibold"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Preferences Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Your Search Criteria
          </h3>
          {preferences.preferences && Array.isArray(preferences.preferences) ? (
            // New multi-preference structure
            <div className="space-y-4">
              {preferences.preferences.map((pref, index) => (
                <div key={index} className="border-l-4 border-slate-400 pl-4">
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Preference {index + 1}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Category:</span>
                      <p className="font-semibold text-slate-900">
                        {pref.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Brands:</span>
                      <p className="font-semibold text-slate-900">
                        {pref.brands.join(", ")}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Budget:</span>
                      <p className="font-semibold text-slate-900">
                        ₹{pref.budget}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Feature Match:</span>
                      <p className="font-semibold text-slate-900">
                        {pref.featurePreference}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Fallback for old structure
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Categories:</span>
                <p className="font-semibold text-slate-900">
                  {preferences.interests?.join(", ")}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Budget:</span>
                <p className="font-semibold text-slate-900">
                  ${preferences.budget}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Brand:</span>
                <p className="font-semibold text-slate-900">
                  {preferences.brandPreference}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Feature:</span>
                <p className="font-semibold text-slate-900">
                  {preferences.featurePreference}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Grid */}
        {recommendations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((product, index) => (
              <div key={product.id} className="space-y-4">
                <ProductCard product={product} rank={index + 1} />

                {/* LLM Explanation (Optional) */}
                {explanations[product.id] && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start gap-2">
                      <FaLightbulb className="text-slate-700 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800 mb-1">
                          Why this matches you
                        </p>
                        <p className="text-sm text-slate-700">
                          {explanations[product.id]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {loadingExplanations && !explanations[product.id] && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-xl text-slate-600">
              No recommendations found matching your criteria. Try adjusting
              your preferences.
            </p>
            <button
              onClick={onReset}
              className="mt-6 px-6 py-3 bg-slate-800 text-white font-semibold rounded-md hover:bg-slate-900 transition-all"
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
