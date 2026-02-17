import { useState } from "react";
import {
  FaShoppingBag,
  FaLaptop,
  FaMusic,
  FaClock,
  FaVial,
  FaTv,
  FaDollarSign,
  FaStar,
  FaPlus,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const CATEGORIES = [
  { value: "Shoes", label: "Shoes", icon: FaShoppingBag },
  { value: "Tech", label: "Tech (Mobiles & Laptops)", icon: FaLaptop },
  { value: "Music", label: "Music", icon: FaMusic },
  { value: "Watches", label: "Watches", icon: FaClock },
  { value: "Perfumes", label: "Perfumes", icon: FaVial },
  { value: "TV", label: "TV", icon: FaTv },
];

// Category-specific brands and features
const CATEGORY_DATA = {
  Shoes: {
    brands: ["Nike", "Adidas", "Puma", "Asics", "New Balance"],
    features: ["Comfort", "Running", "Style", "Sports", "Casual"],
  },
  Tech: {
    brands: ["Apple", "Samsung", "OnePlus", "Dell", "HP", "Lenovo"],
    features: [
      "Camera",
      "Performance",
      "Battery",
      "Gaming",
      "Productivity",
      "Display",
    ],
  },
  Music: {
    brands: ["Bollywood", "EDM", "LoFi", "HipHop", "Classical"],
    features: ["Romantic", "Party", "Focus", "Energetic", "Relaxing"],
  },
  Watches: {
    brands: ["Titan", "Fossil", "Casio", "Apple", "Samsung"],
    features: ["Smart", "Luxury", "Sport", "Casual", "Fitness"],
  },
  Perfumes: {
    brands: ["Dior", "Gucci", "Armani", "Zara", "Calvin Klein"],
    features: ["Regular", "Party", "Sport", "Woody", "Fresh", "Floral"],
  },
  TV: {
    brands: ["Sony", "Samsung", "LG", "Mi", "OnePlus"],
    features: ["4K", "OLED", "QLED", "Smart", "Android"],
  },
};

function PreferenceForm({ onSubmit, user }) {
  const [preferences, setPreferences] = useState([]);

  const addPreference = () => {
    setPreferences([
      ...preferences,
      {
        id: Date.now(),
        category: "",
        brands: [],
        budget: 5000,
        featurePreference: "",
        ratingImportance: 4,
        budgetImportance: 3,
      },
    ]);
  };

  const removePreference = (id) => {
    setPreferences(preferences.filter((p) => p.id !== id));
  };

  const updatePreference = (id, field, value) => {
    setPreferences(
      preferences.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const toggleBrand = (id, brand) => {
    setPreferences(
      preferences.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            brands: p.brands.includes(brand)
              ? p.brands.filter((b) => b !== brand)
              : [...p.brands, brand],
          };
        }
        return p;
      }),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (preferences.length === 0) {
      alert("Please add at least one preference category");
      return;
    }

    const invalid = preferences.find(
      (p) => !p.category || !p.featurePreference,
    );
    if (invalid) {
      alert(
        "Please select category and feature preference for all preferences",
      );
      return;
    }

    // Format data in the structure you specified
    const userData = {
      name: user?.displayName || user?.email?.split("@")[0] || "User",
      email: user?.email,
      preferences: preferences.map((p) => ({
        category: p.category,
        brands: p.brands.length > 0 ? p.brands : ["Any"],
        budget: p.budget,
        featurePreference: p.featurePreference,
        ratingImportance: p.ratingImportance,
        budgetImportance: p.budgetImportance,
        updatedAt: new Date().toISOString(),
      })),
      lastRecommendation: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(userData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Tell Us Your Preferences
            </h2>
            <p className="text-slate-600">
              Add multiple product preferences to get personalized
              recommendations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Preferences List */}
            <div className="space-y-6">
              {preferences.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">No preferences added yet</p>
                  <button
                    type="button"
                    onClick={addPreference}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all"
                  >
                    <FaPlus /> Add First Preference
                  </button>
                </div>
              ) : (
                <>
                  {preferences.map((pref, index) => (
                    <div
                      key={pref.id}
                      className="border border-gray-200 rounded-lg p-6 space-y-6 relative"
                    >
                      {/* Header with Remove Button */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Preference {index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removePreference(pref.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove preference"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Category Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                          Category *
                        </label>
                        <select
                          value={pref.category}
                          onChange={(e) =>
                            updatePreference(
                              pref.id,
                              "category",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                          required
                        >
                          <option value="">Select a category</option>
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Brand Selection */}
                      {pref.category && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Preferred Brands (Select one or more)
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {CATEGORY_DATA[pref.category]?.brands.map(
                              (brand) => (
                                <button
                                  key={brand}
                                  type="button"
                                  onClick={() => toggleBrand(pref.id, brand)}
                                  className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                                    pref.brands.includes(brand)
                                      ? "border-slate-800 bg-slate-50 text-slate-900"
                                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                                  }`}
                                >
                                  {brand}
                                </button>
                              ),
                            )}
                          </div>
                          {pref.brands.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {pref.brands.map((brand) => (
                                <span
                                  key={brand}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-900 rounded-full text-sm"
                                >
                                  {brand}
                                  <button
                                    type="button"
                                    onClick={() => toggleBrand(pref.id, brand)}
                                    className="hover:text-slate-700"
                                  >
                                    <FaTimes size={12} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Budget */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                          <FaDollarSign className="inline mr-1" />
                          Budget: ₹{pref.budget}
                        </label>
                        <input
                          type="range"
                          min="500"
                          max="100000"
                          step="500"
                          value={pref.budget}
                          onChange={(e) =>
                            updatePreference(
                              pref.id,
                              "budget",
                              Number(e.target.value),
                            )
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>₹500</span>
                          <span>₹100,000</span>
                        </div>
                      </div>

                      {/* Feature Preference */}
                      {pref.category && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            <FaStar className="inline mr-1" />
                            What feature matters most? *
                          </label>
                          <select
                            value={pref.featurePreference}
                            onChange={(e) =>
                              updatePreference(
                                pref.id,
                                "featurePreference",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                            required
                          >
                            <option value="">Select a feature</option>
                            {CATEGORY_DATA[pref.category]?.features.map(
                              (feature) => (
                                <option key={feature} value={feature}>
                                  {feature}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      )}

                      {/* Rating & Budget Importance */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Rating Importance (1-5)
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={pref.ratingImportance}
                              onChange={(e) =>
                                updatePreference(
                                  pref.id,
                                  "ratingImportance",
                                  Number(e.target.value),
                                )
                              }
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                            />
                            <span className="text-lg font-bold text-slate-900 min-w-8">
                              {pref.ratingImportance}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            How important are reviews to you?
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Budget Importance (1-5)
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={pref.budgetImportance}
                              onChange={(e) =>
                                updatePreference(
                                  pref.id,
                                  "budgetImportance",
                                  Number(e.target.value),
                                )
                              }
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                            />
                            <span className="text-lg font-bold text-slate-900 min-w-8">
                              {pref.budgetImportance}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            How strictly should we follow your budget?
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Add More Button */}
            {preferences.length > 0 && (
              <button
                type="button"
                onClick={addPreference}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all font-medium"
              >
                <FaPlus /> Add Another Preference
              </button>
            )}

            <button
              type="submit"
              disabled={preferences.length === 0}
              className="w-full bg-slate-800 text-white font-semibold py-4 rounded-md hover:bg-slate-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Personalized Recommendations
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PreferenceForm;
