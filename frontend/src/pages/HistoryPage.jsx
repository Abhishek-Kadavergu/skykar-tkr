import { useState, useEffect } from 'react';
import { FaBox, FaClock, FaStar, FaChartLine } from 'react-icons/fa';
import { getRecommendationHistory } from '../services/firebase';

function HistoryPage({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        try {
          const userHistory = await getRecommendationHistory(user.uid);
          setHistory(userHistory || []);
        } catch (error) {
          console.error('Error loading history:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            <FaClock className="inline mr-3" />
            Your History
          </h1>
          <p className="text-slate-600">
            View all your past recommendations and preferences
          </p>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FaBox className="text-6xl text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No History Yet</h3>
            <p className="text-slate-600 mb-6">
              Start getting recommendations to build your history
            </p>
            <a
              href="/recommendations"
              className="inline-block px-6 py-3 bg-slate-800 text-white font-semibold rounded-md hover:bg-slate-900 transition-all"
            >
              Get Recommendations
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((entry, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Search #{history.length - index}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Unknown date'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                    <FaChartLine className="text-slate-700" />
                    <span className="font-semibold text-slate-800">
                      {entry.recommendations?.length || 0} Results
                    </span>
                  </div>
                </div>

                {/* Preferences Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                  <h4 className="font-semibold text-slate-800 mb-2">Search Criteria:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Categories:</span>
                      <p className="font-semibold text-slate-900">
                        {entry.preferences?.interests?.join(', ') || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Budget:</span>
                      <p className="font-semibold text-slate-900">
                        ${entry.preferences?.budget || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Brand:</span>
                      <p className="font-semibold text-slate-900">
                        {entry.preferences?.brandPreference || 'Any'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Feature:</span>
                      <p className="font-semibold text-slate-900">
                        {entry.preferences?.featurePreference || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Top Recommendations:</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {entry.recommendations?.slice(0, 3).map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-slate-900 text-sm">{product.name}</h5>
                          <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs font-bold">
                            {product.matchScore}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-1">{product.brand}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">${product.price}</span>
                          <div className="flex items-center gap-1 text-xs">
                            <FaStar className="text-yellow-500" />
                            <span className="text-slate-600">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
