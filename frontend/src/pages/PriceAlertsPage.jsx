import { useState, useEffect } from 'react';
import { FaBell, FaRupeeSign, FaTrash, FaCheck, FaPlus } from 'react-icons/fa';
import { getRecommendations, getRecommendationHistory } from '../services/api';

/**
 * Price Alerts Component - Feature #5
 * Set price drop alerts for products - FULLY DYNAMIC
 */
function PriceAlertsPage({ user }) {
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAlert, setShowAddAlert] = useState(false);

  useEffect(() => {
    loadAlerts();
    loadProducts();
    checkPriceDrops();
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

      // Combine all products
      const allProducts = [...currentRecs];
      history.forEach(record => {
        if (record.products) {
          allProducts.push(...record.products);
        }
      });

      // Remove duplicates and filter out products without prices
      const uniqueProducts = Array.from(
        new Map(allProducts.map(p => [p.id, p])).values()
      ).filter(p => p.price && p.price > 0);

      setProducts(uniqueProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = () => {
    try {
      const saved = localStorage.getItem(`priceAlerts_${user?.uid}`);
      if (saved) {
        setAlerts(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const createAlert = (product, targetPrice) => {
    const alert = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      currentPrice: product.price,
      targetPrice: parseFloat(targetPrice),
      createdAt: new Date().toISOString(),
      category: product.category,
      image: product.image,
      triggered: false
    };

    const updated = [alert, ...alerts];
    setAlerts(updated);
    localStorage.setItem(`priceAlerts_${user?.uid}`, JSON.stringify(updated));
    return alert;
  };

  const removeAlert = (id) => {
    const updated = alerts.filter(a => a.id !== id);
    setAlerts(updated);
    localStorage.setItem(`priceAlerts_${user?.uid}`, JSON.stringify(updated));
  };

  const checkPriceDrops = () => {
    // In a real app, this would check against live product prices
    // For now, it's a placeholder for the feature
    alerts.forEach(alert => {
      if (!alert.triggered && alert.currentPrice <= alert.targetPrice) {
        triggerAlert(alert);
      }
    });
  };

  const triggerAlert = (alert) => {
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Price Alert! 🎉', {
        body: `${alert.productName} dropped to ₹${alert.currentPrice}!`,
        icon: alert.image
      });
    }

    // Mark as triggered
    const updated = alerts.map(a =>
      a.id === alert.id ? { ...a, triggered: true } : a
    );
    setAlerts(updated);
    localStorage.setItem(`priceAlerts_${user?.uid}`, JSON.stringify(updated));
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const savingAmount = (alert) => {
    return alert.currentPrice - alert.targetPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <FaBell className="text-slate-900 dark:text-white" />
                Price Alerts
              </h1>
              <p className="text-slate-600 dark:text-slate-400">Get notified when prices drop below your target</p>
            </div>
            {Notification.permission === 'default' && (
              <button
                onClick={requestNotificationPermission}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-md hover:bg-black dark:hover:bg-slate-600 transition font-semibold"
              >
                Enable Notifications
              </button>
            )}
          </div>
        </div>

        {/* Create New Alert from Products */}
        {loading ? (
          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-12 text-center mb-8 transition-colors duration-200">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-800 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Loading products...</p>
          </div>
        ) : products.length > 0 && (
          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors duration-200">
            <button
              onClick={() => setShowAddAlert(!showAddAlert)}
              className="w-full flex items-center justify-between mb-4"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FaPlus className="text-slate-900 dark:text-white" />
                Create New Alert
              </h2>
              <span className="text-slate-600 dark:text-slate-400 font-semibold">
                {showAddAlert ? 'Hide' : `${products.length} products available`}
              </span>
            </button>

            {showAddAlert && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {products.map((product) => {
                  const hasAlert = alerts.find(a => a.productId === product.id);
                  return (
                    <div
                      key={product.id}
                      className={`p-3 border-2 rounded-lg transition-colors duration-200 ${hasAlert ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-slate-700'
                        }`}
                    >
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
                      <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-bold mb-2">
                        <FaRupeeSign className="text-xs" />
                        {product.price?.toLocaleString('en-IN')}
                      </div>

                      {hasAlert ? (
                        <div className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                          <FaCheck />
                          Alert Active
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const targetPrice = prompt(`Current price: ₹${product.price}\nEnter your target price (₹):`, Math.floor(product.price * 0.9));
                            if (targetPrice && !isNaN(targetPrice) && parseFloat(targetPrice) > 0) {
                              createAlert(product, targetPrice);
                              alert(`Alert created! You'll be notified when ${product.name} drops to ₹${parseFloat(targetPrice).toLocaleString('en-IN')}`);
                            }
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold rounded hover:bg-black dark:hover:bg-slate-600 transition"
                        >
                          Set Alert
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Active Alerts */}
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white dark:bg-black rounded-lg shadow-sm border p-6 transition-colors duration-200 ${alert.triggered ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-slate-800'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {alert.image && (
                      <img
                        src={alert.image}
                        alt={alert.productName}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                          {alert.productName}
                        </h3>
                        {alert.triggered && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                            <FaCheck className="text-xs" />
                            Alert Triggered!
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{alert.category}</p>

                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Current Price</span>
                          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                            <FaRupeeSign className="text-sm" />
                            {alert.currentPrice?.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Target Price</span>
                          <p className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                            <FaRupeeSign className="text-sm" />
                            {alert.targetPrice?.toLocaleString('en-IN')}
                          </p>
                        </div>
                        {savingAmount(alert) > 0 && (
                          <div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Potential Savings</span>
                            <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <FaRupeeSign className="text-sm" />
                              {savingAmount(alert)?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="px-4 py-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition flex items-center gap-2"
                  >
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-12 text-center transition-colors duration-200">
            <FaBell className="text-6xl text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Price Alerts Yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create alerts from product cards to get notified when prices drop
            </p>
            <a
              href="/recommendations"
              className="inline-block px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-900 dark:hover:bg-slate-600 transition"
            >
              Browse Products
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Export function to create alert from other components
export const createPriceAlert = (user, product, targetPrice) => {
  try {
    const saved = localStorage.getItem(`priceAlerts_${user?.uid}`);
    const alerts = saved ? JSON.parse(saved) : [];

    const alert = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      currentPrice: product.price,
      targetPrice: parseFloat(targetPrice),
      createdAt: new Date().toISOString(),
      category: product.category,
      image: product.image,
      triggered: false
    };

    const updated = [alert, ...alerts];
    localStorage.setItem(`priceAlerts_${user?.uid}`, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error creating price alert:', error);
    return false;
  }
};

export default PriceAlertsPage;
