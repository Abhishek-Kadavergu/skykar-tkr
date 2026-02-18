import { useState } from 'react';
import { FaFilter, FaSortAmountDown, FaStar, FaRupeeSign, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

/**
 * Filter and Sort Component - Feature #1
 * Allows filtering by price, rating, distance, open status
 * Sorting by price, rating, distance, popularity
 */
function FilterSort({ onFilterChange, onSortChange, showDistance = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minRating: 0,
    openNow: false,
    maxDistance: ''
  });
  const [sortBy, setSortBy] = useState('rating-desc');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const clearFilters = () => {
    const clearedFilters = {
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      openNow: false,
      maxDistance: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 mb-6 transition-colors duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-slate-800 transition-colors duration-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
            <FaFilter className="text-slate-600 dark:text-slate-400" />
            Filter & Sort Options
          </div>
          <span className={`transform transition-transform text-slate-600 dark:text-slate-400 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Filters Section */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FaFilter className="text-slate-600 dark:text-slate-400" />
                Filters
              </h3>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <FaRupeeSign className="inline" /> Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
                  />
                  <span className="flex items-center text-slate-500 dark:text-slate-400">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <FaStar className="inline text-yellow-500" /> Minimum Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
                >
                  <option value="0">Any Rating</option>
                  <option value="3.0">3+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="4.0">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Distance Filter (for location-based results) */}
              {showDistance && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <FaMapMarkerAlt className="inline text-red-500" /> Max Distance (km)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 5"
                    value={filters.maxDistance}
                    onChange={(e) => handleFilterChange('maxDistance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
                  />
                </div>
              )}

              {/* Open Now Checkbox */}
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                    className="w-4 h-4 text-slate-600 border-gray-300 dark:border-slate-600 rounded focus:ring-slate-500 bg-white dark:bg-slate-700"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    <FaClock className="inline text-green-500" /> Open Now Only
                  </span>
                </label>
              </div>
            </div>

            {/* Sort Section */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FaSortAmountDown className="text-slate-600 dark:text-slate-400" />
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
              >
                <option value="rating-desc">Rating: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                {showDistance && <option value="distance-asc">Distance: Nearest First</option>}
                <option value="popularity">Most Popular</option>
                <option value="match-score">Best Match</option>
              </select>
            </div>
          </div>

          {/* Clear Button */}
          <div className="border-t border-gray-200 dark:border-slate-800 pt-4 transition-colors duration-200">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterSort;
