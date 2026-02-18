import { useState, useEffect } from 'react';
import { FaClock, FaHistory, FaRedo } from 'react-icons/fa';

/**
 * Recent Searches Component - Feature #4
 * Shows last 5 preference searches for quick re-run
 */
function RecentSearches({ user, onSelectSearch }) {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    loadRecentSearches();
  }, [user]);

  const loadRecentSearches = () => {
    try {
      const saved = localStorage.getItem(`recentSearches_${user?.uid}`);
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveSearch = (preferences) => {
    try {
      const searches = JSON.parse(localStorage.getItem(`recentSearches_${user?.uid}`) || '[]');
      
      // Add timestamp and avoid duplicates
      const newSearch = {
        ...preferences,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      const updated = [newSearch, ...searches.filter(s => 
        JSON.stringify(s.preferences) !== JSON.stringify(preferences.preferences)
      )].slice(0, 5);
      
      localStorage.setItem(`recentSearches_${user?.uid}`, JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const clearHistory = () => {
    if (confirm('Clear all recent searches?')) {
      localStorage.removeItem(`recentSearches_${user?.uid}`);
      setRecentSearches([]);
    }
  };

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <FaHistory className="text-slate-600" />
          Recent Searches
        </h3>
        <button
          onClick={clearHistory}
          className="text-sm text-slate-500 hover:text-red-600 transition"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-2">
        {recentSearches.map((search) => (
          <button
            key={search.id}
            onClick={() => onSelectSearch(search)}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                  <FaClock className="text-xs" />
                  {new Date(search.timestamp).toLocaleString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="text-slate-900 font-medium">
                  {search.preferences?.map(p => p.category).join(', ')}
                </div>
              </div>
              <FaRedo className="text-slate-400 group-hover:text-slate-600 transition" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Export save function for use in other components
export const saveRecentSearch = (user, preferences) => {
  try {
    const searches = JSON.parse(localStorage.getItem(`recentSearches_${user?.uid}`) || '[]');
    const newSearch = {
      ...preferences,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    const updated = [newSearch, ...searches].slice(0, 5);
    localStorage.setItem(`recentSearches_${user?.uid}`, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving search:', error);
  }
};

export default RecentSearches;
