import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaHistory, FaSignOutAlt, FaThLarge, FaRobot, FaHeart, FaExchangeAlt, FaWallet, FaBell, FaTrophy, FaChevronDown, FaMoon, FaSun } from 'react-icons/fa';
import DarkModeToggle from './DarkModeToggle';

function Navbar({ user, onLogout }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const getInitials = (name, email) => {
    if (name) {
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className={`bg-white dark:bg-black border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center">
              <FaThLarge className="text-white text-sm" />
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-white">
              AalayaX
            </span>
          </Link>

          {/* Navigation Links */}
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to="/home"
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                >
                  <FaHome className="text-lg" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/recommendations"
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                >
                  <FaThLarge className="text-lg" />
                  <span>Recommendations</span>
                </Link>

                <Link
                  to="/ai-assistant"
                  data-tour="nav-ai-assistant"
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                >
                  <FaRobot className="text-lg" />
                  <span>AI Assistant</span>
                </Link>

                {/* Features Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFeaturesMenu(!showFeaturesMenu)}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                  >
                    <FaThLarge className="text-lg" />
                    <span>Features</span>
                    <FaChevronDown className={`text-sm transition-transform ${showFeaturesMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showFeaturesMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowFeaturesMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 py-2">
                        <Link
                          to="/favorites"
                          onClick={() => setShowFeaturesMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                        >
                          <FaHeart className="text-red-500" />
                          My Favorites
                        </Link>
                        <Link
                          to="/comparison"
                          onClick={() => setShowFeaturesMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                        >
                          <FaExchangeAlt className="text-slate-700 dark:text-slate-300" />
                          Compare Products
                        </Link>
                        <Link
                          to="/budget-tracker"
                          onClick={() => setShowFeaturesMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                        >
                          <FaWallet className="text-green-500" />
                          Budget Tracker
                        </Link>
                        <Link
                          to="/price-alerts"
                          onClick={() => setShowFeaturesMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                        >
                          <FaBell className="text-orange-500" />
                          Price Alerts
                        </Link>
                        <Link
                          to="/achievements"
                          onClick={() => setShowFeaturesMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                        >
                          <FaTrophy className="text-yellow-500" />
                          Achievements
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Dark Mode Toggle */}
                <DarkModeToggle />
                <Link
                  to="/history"
                  data-tour="nav-history"
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                >
                  <FaHistory className="text-lg" />
                  <span>History</span>
                </Link>

                {/* Profile Picture and Logout */}
                <div className="flex items-center gap-3 ml-2 pl-6 border-l border-gray-300 dark:border-slate-700">
                  <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-9 h-9 rounded-full border-2 border-slate-300 dark:border-slate-600 object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-semibold border-2 border-slate-300">
                        {getInitials(user?.displayName, user?.email)}
                      </div>
                    )}
                  </Link>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-all font-medium"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Controls */}
              <div className="md:hidden flex items-center gap-4">
                <Link to="/history" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <FaHistory className="text-lg" />
                </Link>
                <button
                  onClick={onLogout}
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <FaSignOutAlt className="text-lg" />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-all font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav >
  );
}

export default Navbar;
