import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaRocket, FaHistory, FaUser, FaChartLine, FaUtensils, FaFilm, FaMusic, FaShoppingBag, FaLaptop, FaClock, FaVial, FaTv, FaRobot, FaTag } from 'react-icons/fa';
import { getUserStats } from '../services/api';
import TourTrigger from '../components/TourTrigger';

function HomePage({ user }) {
  const [stats, setStats] = useState({
    totalSearches: 0,
    productsViewed: 0,
    categoriesExplored: [],
    favoritesCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const data = await getUserStats(user.uid);
      setStats(data.stats || stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-6 transition-colors duration-300">
      {/* Tour Trigger Button */}
      <TourTrigger />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Welcome Section - Compact Hero Style */}
        <div className="text-center py-6 md:py-8 fade-in">
          <h1 className="text-3xl md:text-5xl heading-premium mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-400">{user?.displayName || 'Traveler'}</span>
          </h1>
          <p className="text-lg md:text-xl text-body-premium max-w-2xl mx-auto">
            Your personal gateway to curated products and smart recommendations.
          </p>
        </div>

        {/* Quick Actions Grid - Compact & Responsive */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          {/* AI Assistant - Featured Card */}
          <Link
            to="/ai-assistant"
            data-tour="ai-assistant-btn"
            className="premium-card p-6 md:p-8 group relative overflow-hidden md:col-span-1 bg-slate-900 text-white dark:bg-black dark:text-white border-transparent dark:border-slate-800"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FaRobot className="text-8xl md:text-9xl transform rotate-12" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <FaRobot className="text-3xl md:text-4xl mb-4 md:mb-6 text-white dark:text-white" />
                <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 tracking-tight">AI Assistant</h2>
                <p className="text-slate-300 dark:text-slate-600 text-base md:text-lg leading-relaxed">
                  Chat with our advanced AI for personalized discovery and smart answers.
                </p>
              </div>
              <div className="mt-6 md:mt-8 flex items-center gap-2 font-semibold text-sm md:text-base">
                Start Chatting <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Other Actions - Standard Premium Cards */}
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-4 md:gap-8">
            <Link
              to="/recommendations"
              data-tour="recommendations-btn"
              className="premium-card p-6 md:p-8 group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <FaRocket className="text-xl md:text-2xl text-slate-900 dark:text-white" />
                </div>
                <h2 className="text-xl md:text-2xl heading-premium mb-2 md:mb-3">Get Recommendations</h2>
                <p className="text-sm md:text-base text-body-premium">
                  Tell us your preferences and let our engine find the perfect match for you.
                </p>
              </div>
              <div className="mt-4 md:mt-6 text-slate-900 dark:text-white font-medium flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity text-sm md:text-base">
                Explore Now <span>→</span>
              </div>
            </Link>

            <Link
              to="/history"
              className="premium-card p-6 md:p-8 group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <FaHistory className="text-xl md:text-2xl text-slate-900 dark:text-white" />
                </div>
                <h2 className="text-xl md:text-2xl heading-premium mb-2 md:mb-3">View History</h2>
                <p className="text-sm md:text-base text-body-premium">
                  Revisit your past discoveries and manage your saved preferences.
                </p>
              </div>
              <div className="mt-4 md:mt-6 text-slate-900 dark:text-white font-medium flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity text-sm md:text-base">
                View Archive <span>→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Section - Compact */}
        <div className="mt-10 md:mt-16" data-tour="stats-section">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <FaChartLine className="text-slate-900 dark:text-white text-lg md:text-xl" />
            <h3 className="text-lg md:text-xl heading-premium uppercase tracking-widest text-sm">Your Insights</h3>
          </div>

          {loading ? (
            <div className="premium-card p-8 text-center text-slate-500">Loading insights...</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Searches', value: stats.totalSearches },
                { label: 'Products Viewed', value: stats.productsViewed },
                { label: 'Saved Favorites', value: stats.favoritesCount || 0 },
                { label: 'Categories', value: stats.categoriesExplored?.length || 0 }
              ].map((stat, idx) => (
                <div key={idx} className="premium-card p-4 md:p-6 text-center group hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <div className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300 block">
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Categories - Compact Grid */}
        <div className="mt-10 md:mt-16">
          <h3 className="text-lg md:text-xl heading-premium uppercase tracking-widest text-sm mb-6 md:mb-8 flex items-center gap-3">
            <FaTag className="text-slate-900 dark:text-white" />
            Popular Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { icon: FaUtensils, label: 'Restaurants' },
              { icon: FaFilm, label: 'Movies & TV' },
              { icon: FaMusic, label: 'Music' },
              { icon: FaShoppingBag, label: 'Fashion' },
              { icon: FaLaptop, label: 'Technology' },
              { icon: FaClock, label: 'Watches' },
              { icon: FaVial, label: 'Perfumes' },
              { icon: FaTv, label: 'Electronics' }
            ].map((cat, idx) => (
              <div key={idx} className="premium-card p-4 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-slate-400 dark:hover:border-slate-600">
                <cat.icon className="text-2xl text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300" />
                <h4 className="font-medium text-xs md:text-sm text-slate-700 dark:text-slate-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {cat.label}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
