import { useState, useEffect } from 'react';
import { FaCheckSquare, FaSquare, FaExchangeAlt, FaStar, FaRupeeSign, FaTimes } from 'react-icons/fa';
import { getRecommendations, getRecommendationHistory } from '../services/api';

/**
 * Comparison View - Feature #6
 * Compare 2-4 products side by side - FULLY DYNAMIC
 */
function ComparisonPage({ user }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Get current recommendations and history
      const [currentRecs, history] = await Promise.all([
        getRecommendations(user.uid),
        getRecommendationHistory(user.uid)
      ]);

      // Combine all products from recommendations and history
      const allProducts = [...currentRecs];
      history.forEach(record => {
        if (record.products) {
          allProducts.push(...record.products);
        }
      });

      // Remove duplicates by ID
      const uniqueProducts = Array.from(
        new Map(allProducts.map(p => [p.id, p])).values()
      );

      setAvailableProducts(uniqueProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      alert('You can compare up to 4 products at a time');
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const getComparisonRows = () => {
    if (selectedProducts.length === 0) return [];

    const rows = [
      { label: 'Name', key: 'name', type: 'text' },
      { label: 'Price', key: 'price', type: 'price' },
      { label: 'Rating', key: 'rating', type: 'rating' },
      { label: 'Category', key: 'category', type: 'text' },
      { label: 'Brand', key: 'brand', type: 'text' },
      { label: 'Description', key: 'description', type: 'text' },
    ];

    // Add dynamic feature rows if products have specifications
    const allSpecKeys = new Set();
    selectedProducts.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => allSpecKeys.add(key));
      }
    });

    allSpecKeys.forEach(key => {
      rows.push({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        key: `spec_${key}`,
        type: 'spec'
      });
    });

    return rows;
  };

  const renderCellValue = (product, row) => {
    if (row.type === 'spec') {
      const specKey = row.key.replace('spec_', '');
      return product.specifications?.[specKey] || 'N/A';
    }

    switch (row.type) {
      case 'price':
        return (
          <div className="flex items-center justify-center gap-1 text-lg font-bold text-green-600">
            <FaRupeeSign />
            {product[row.key]?.toLocaleString('en-IN') || 'N/A'}
          </div>
        );
      case 'rating':
        return (
          <div className="flex items-center justify-center gap-1 text-yellow-500">
            <FaStar />
            <span className="font-semibold">{product[row.key] || 'N/A'}/5</span>
          </div>
        );
      default:
        return product[row.key] || 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors duration-200">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <FaExchangeAlt className="text-slate-800 dark:text-white" />
            Compare Products
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Select 2-4 products from your recommendations to compare side by side
          </p>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-12 text-center transition-colors duration-200">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-800 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Loading products...</p>
          </div>
        ) : availableProducts.length === 0 ? (
          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-12 text-center transition-colors duration-200">
            <FaExchangeAlt className="text-6xl text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Products Available</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Get recommendations first to compare products
            </p>
            <a
              href="/recommendations"
              className="inline-block px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-900 dark:hover:bg-slate-600 transition"
            >
              Get Recommendations
            </a>
          </div>
        ) : (
          <>
            {/* Product Selection Grid */}
            <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-6 transition-colors duration-200">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Select Products ({selectedProducts.length}/4)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {availableProducts.map((product) => {
                  const isSelected = selectedProducts.find(p => p.id === product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => toggleProduct(product)}
                      className={`relative p-3 border-2 rounded-lg cursor-pointer transition ${isSelected
                        ? 'border-slate-900 bg-slate-50 dark:bg-slate-800 dark:border-white'
                        : 'border-gray-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                        }`}
                    >
                      {isSelected && (
                        <FaCheckSquare className="absolute top-2 right-2 text-slate-900 dark:text-white text-xl" />
                      )}
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-24 object-cover rounded-md mb-2"
                        />
                      )}
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-green-600 font-bold">
                        <FaRupeeSign className="text-xs" />
                        {product.price?.toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-yellow-500">
                        <FaStar />
                        {product.rating}/5
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedProducts.length === 0 ? (
              <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-6 text-center transition-colors duration-200">
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  👆 Select products above to start comparing
                </p>
              </div>
            ) : selectedProducts.length === 1 ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center transition-colors duration-200">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Select at least one more product to start comparing
                </p>
              </div>
            ) : (
              <>
                {/* Comparison Table */}
                <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors duration-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-slate-700 transition-colors duration-200">
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 dark:text-white min-w-[150px]">
                            Feature
                          </th>
                          {selectedProducts.map((product) => (
                            <th key={product.id} className="px-4 py-4 text-center font-semibold text-slate-900 dark:text-white min-w-[200px] relative">
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition"
                                title="Remove from comparison"
                              >
                                <FaTimes />
                              </button>
                              <div className="pr-8">
                                {product.image && (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                                  />
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getComparisonRows().map((row, index) => (
                          <tr
                            key={row.key}
                            className={index % 2 === 0 ? 'bg-white dark:bg-black' : 'bg-gray-50 dark:bg-zinc-900/50'}
                          >
                            <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300 border-r border-gray-200 dark:border-slate-700">
                              {row.label}
                            </td>
                            {selectedProducts.map((product) => (
                              <td key={product.id} className="px-4 py-4 text-center text-slate-600 dark:text-slate-400">
                                {renderCellValue(product, row)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-4 justify-center">
                  <button
                    onClick={() => setSelectedProducts([])}
                    className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-900 dark:hover:bg-slate-600 transition"
                  >
                    Print Comparison
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ComparisonPage;
