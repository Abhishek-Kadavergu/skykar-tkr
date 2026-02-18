import { useState, useEffect } from 'react';
import { FaWallet, FaChartLine, FaRupeeSign, FaCalendar, FaExclamationTriangle, FaDownload } from 'react-icons/fa';
import { getUserStats, getRecommendationHistory } from '../services/api';

/**
 * Budget Tracker - Feature #14
 * Track purchases and spending across categories with insights - FULLY DYNAMIC
 */
function BudgetTrackerPage({ user }) {
  const [purchases, setPurchases] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(50000);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadPurchases();
    loadRecommendations();
  }, [user]);

  const loadPurchases = () => {
    try {
      const saved = localStorage.getItem(`purchases_${user?.uid}`);
      if (saved) {
        setPurchases(JSON.parse(saved));
      }

      const savedBudget = localStorage.getItem(`monthlyBudget_${user?.uid}`);
      if (savedBudget) {
        setMonthlyBudget(parseFloat(savedBudget));
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    if (!user) return;
    try {
      const history = await getRecommendationHistory(user.uid);
      const allProducts = [];
      history.forEach(record => {
        if (record.products) {
          allProducts.push(...record.products);
        }
      });
      // Remove duplicates
      const unique = Array.from(new Map(allProducts.map(p => [p.id, p])).values());
      setRecommendations(unique);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const addPurchase = (product) => {
    const purchase = {
      ...product,
      purchaseDate: new Date().toISOString(),
      id: Date.now()
    };

    const updated = [purchase, ...purchases];
    setPurchases(updated);
    localStorage.setItem(`purchases_${user?.uid}`, JSON.stringify(updated));
  };

  const removePurchase = (id) => {
    const updated = purchases.filter(p => p.id !== id);
    setPurchases(updated);
    localStorage.setItem(`purchases_${user?.uid}`, JSON.stringify(updated));
  };

  const updateMonthlyBudget = (newBudget) => {
    setMonthlyBudget(newBudget);
    localStorage.setItem(`monthlyBudget_${user?.uid}`, newBudget.toString());
  };

  const getCurrentMonthPurchases = () => {
    const now = new Date();
    return purchases.filter(p => {
      const purchaseDate = new Date(p.purchaseDate);
      return purchaseDate.getMonth() === now.getMonth() &&
        purchaseDate.getFullYear() === now.getFullYear();
    });
  };

  const calculateTotalSpent = () => {
    return getCurrentMonthPurchases().reduce((sum, p) => sum + (p.price || 0), 0);
  };

  const getSpendingByCategory = () => {
    const categorySpending = {};
    getCurrentMonthPurchases().forEach(p => {
      const cat = p.category || 'Other';
      categorySpending[cat] = (categorySpending[cat] || 0) + (p.price || 0);
    });
    return categorySpending;
  };

  const totalSpent = calculateTotalSpent();
  const budgetPercentage = (totalSpent / monthlyBudget) * 100;
  const remaining = monthlyBudget - totalSpent;
  const categorySpending = getSpendingByCategory();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors duration-200">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <FaWallet className="text-green-600" />
            Budget Tracker
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Monitor your spending and stay on budget</p>
        </div>

        {/* Quick Actions - Import from Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-8 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FaDownload />
                  Import from Recommendations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Found {recommendations.length} products from your recommendation history
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
              {recommendations.slice(0, 12).map((product) => (
                <div
                  key={product.id}
                  onClick={() => addPurchase(product)}
                  className="p-3 bg-white dark:bg-black border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-16 object-cover rounded mb-2"
                    />
                  )}
                  <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 mb-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                    <FaRupeeSign className="text-xs" />
                    {product.price?.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 dark:text-slate-400">Monthly Budget</span>
              <FaCalendar className="text-slate-400" />
            </div>
            <div className="flex items-center gap-1 text-2xl font-bold text-slate-900 dark:text-white">
              <FaRupeeSign />
              {monthlyBudget.toLocaleString('en-IN')}
            </div>
            <button
              onClick={() => {
                const newBudget = prompt('Enter new monthly budget (₹):', monthlyBudget);
                if (newBudget && !isNaN(newBudget)) {
                  updateMonthlyBudget(parseFloat(newBudget));
                }
              }}
              className="mt-3 text-sm text-slate-900 dark:text-white hover:text-slate-700 font-medium"
            >
              Update Budget
            </button>
          </div>

          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 dark:text-slate-400">Total Spent (This Month)</span>
              <FaChartLine className="text-slate-400" />
            </div>
            <div className="flex items-center gap-1 text-2xl font-bold text-red-600">
              <FaRupeeSign />
              {totalSpent.toLocaleString('en-IN')}
            </div>
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {budgetPercentage.toFixed(1)}% of budget used
            </div>
          </div>

          <div className={`bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-200 ${remaining < 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 dark:text-slate-400">Remaining</span>
              {remaining < 0 && <FaExclamationTriangle className="text-red-500" />}
            </div>
            <div className={`flex items-center gap-1 text-2xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
              <FaRupeeSign />
              {Math.abs(remaining).toLocaleString('en-IN')}
            </div>
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {remaining < 0 ? 'Over budget!' : 'Within budget'}
            </div>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors duration-200">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Budget Progress</h3>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
            <div
              className={`h-full transition-all ${budgetPercentage > 100 ? 'bg-red-500' : budgetPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {budgetPercentage > 100
              ? `You've exceeded your budget by ${(budgetPercentage - 100).toFixed(1)}%`
              : `${(100 - budgetPercentage).toFixed(1)}% remaining`
            }
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors duration-200">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Spending by Category</h3>
          <div className="space-y-3">
            {Object.entries(categorySpending).length > 0 ? (
              Object.entries(categorySpending).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300">{category}</span>
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                    <FaRupeeSign className="text-sm" />
                    {amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">No purchases this month</p>
            )}
          </div>
        </div>

        {/* Purchase History */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-200">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Purchases</h3>
          {getCurrentMonthPurchases().length > 0 ? (
            <div className="space-y-3">
              {getCurrentMonthPurchases().map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-md transition-colors duration-200">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-white">{purchase.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(purchase.purchaseDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                      <FaRupeeSign />
                      {purchase.price?.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removePurchase(purchase.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No purchases recorded this month</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Export function to add purchase from other components
export const addPurchaseToTracker = (user, product) => {
  try {
    const saved = localStorage.getItem(`purchases_${user?.uid}`);
    const purchases = saved ? JSON.parse(saved) : [];

    const purchase = {
      ...product,
      purchaseDate: new Date().toISOString(),
      id: Date.now()
    };

    const updated = [purchase, ...purchases];
    localStorage.setItem(`purchases_${user?.uid}`, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error adding purchase:', error);
    return false;
  }
};

export default BudgetTrackerPage;
