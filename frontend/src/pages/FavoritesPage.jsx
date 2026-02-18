import { useState, useEffect } from 'react';
import { FaHeart, FaTrash, FaStar, FaRupeeSign, FaShoppingCart } from 'react-icons/fa';
import { getFavorites, removeFromFavorites } from '../services/api';
import ProductCard from '../components/ProductCard';

/**
 * Favorites Page - Feature #2
 * Display all favorited items with management options
 */
function FavoritesPage({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getFavorites(user.uid);
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    if (!confirm('Remove this item from favorites?')) return;

    setRemovingId(productId);
    try {
      await removeFromFavorites(user.uid, productId);
      setFavorites(favorites.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const calculateTotalValue = () => {
    return favorites.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <FaHeart className="text-red-500" />
                My Favorites
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            {favorites.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Value</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <FaRupeeSign className="text-xl" />
                  {calculateTotalValue().toLocaleString('en-IN')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-12 text-center transition-colors duration-200">
            <FaHeart className="text-6xl text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Favorites Yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start adding items to your favorites to see them here
            </p>
            <a
              href="/recommendations"
              className="inline-block px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-900 dark:hover:bg-slate-600 transition"
            >
              Browse Recommendations
            </a>
          </div>
        ) : (
          <>
            {/* Favorites Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} user={user} showFavorite={false} />
                  <button
                    onClick={() => handleRemove(product.id)}
                    disabled={removingId === product.id}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition disabled:opacity-50 shadow-lg z-10"
                    title="Remove from favorites"
                  >
                    {removingId === product.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.open('/recommendations', '_self')}
                  className="px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-900 dark:hover:bg-slate-600 transition flex items-center justify-center gap-2"
                >
                  <FaShoppingCart />
                  Find More Items
                </button>
                <button
                  onClick={() => {
                    const text = favorites.map(f => `${f.name} - ₹${f.price}`).join('\n');
                    navigator.clipboard.writeText(text);
                    alert('Favorites list copied to clipboard!');
                  }}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                >
                  Share List
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
