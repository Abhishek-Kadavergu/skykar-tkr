import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaRobot, FaUser, FaThLarge, FaHeart, FaExchangeAlt, FaWallet, FaBell, FaTrophy } from 'react-icons/fa';

function MobileBottomNav({ user }) {
    const location = useLocation();
    const [showFeatures, setShowFeatures] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Nav Items configuration according to user request:
    // 1. Home
    // 2. Explore (Recommendations) - Search Icon - "dont change the recommandation"
    // 3. AI
    // 4. Features - Grid Icon - Toggle Menu - "keep the features not wish list"
    // 5. Profile
    const navItems = [
        { path: '/home', icon: FaHome, label: 'Home' },
        { path: '/recommendations', icon: FaSearch, label: 'Explore' },
        { path: '/ai-assistant', icon: FaRobot, label: 'AI', isSpecial: true },
        { icon: FaThLarge, label: 'Features', isAction: true, onClick: () => setShowFeatures(!showFeatures) },
        { path: '/profile', icon: FaUser, label: 'Profile' },
    ];

    const featureItems = [
        { path: '/favorites', icon: FaHeart, label: 'Favorites', color: 'text-red-500' },
        { path: '/comparison', icon: FaExchangeAlt, label: 'Compare', color: 'text-blue-500' },
        { path: '/budget-tracker', icon: FaWallet, label: 'Budget', color: 'text-green-500' },
        { path: '/price-alerts', icon: FaBell, label: 'Alerts', color: 'text-orange-500' },
        { path: '/achievements', icon: FaTrophy, label: 'Awards', color: 'text-yellow-500' },
    ];

    return (
        <>
            {/* Features Menu Popup */}
            {showFeatures && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        onClick={() => setShowFeatures(false)}
                    />
                    <div className="fixed bottom-20 right-4 z-50 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 p-1.5 animate-in slide-in-from-bottom-5 duration-200">
                        <div className="grid grid-cols-1 gap-0.5">
                            {featureItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setShowFeatures(false)}
                                    className="flex items-center gap-2.5 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <div className={`p-1.5 rounded-md bg-gray-50 dark:bg-slate-800 ${item.color}`}>
                                        <item.icon className="text-sm" />
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-200 text-xs">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Bottom Navigation Dock */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-gray-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item, index) => {
                        const active = item.path ? isActive(item.path) : showFeatures;
                        const Icon = item.icon;

                        if (item.isSpecial) {
                            return (
                                <Link
                                    key={index}
                                    to={item.path}
                                    onClick={() => setShowFeatures(false)}
                                    className="relative -top-4"
                                >
                                    <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform duration-200
                    ${active
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black scale-110 ring-4 ring-slate-100 dark:ring-slate-900'
                                            : 'bg-slate-800 dark:bg-slate-800 text-white'
                                        }
                  `}>
                                        <Icon className="text-lg" />
                                    </div>
                                </Link>
                            );
                        }

                        if (item.isAction) {
                            return (
                                <button
                                    key={index}
                                    onClick={item.onClick}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${active
                                        ? 'text-slate-900 dark:text-white'
                                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <Icon className={`text-lg mb-0.5 ${active ? 'transform scale-110' : ''}`} />
                                    {active && <div className="w-1 h-1 bg-slate-900 dark:bg-white rounded-full mt-0.5" />}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={() => setShowFeatures(false)}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${active
                                    ? 'text-slate-900 dark:text-white'
                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Icon className={`text-lg mb-0.5 ${active ? 'transform scale-110' : ''}`} />
                                {active && <div className="w-1 h-1 bg-slate-900 dark:bg-white rounded-full mt-0.5" />}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default MobileBottomNav;
