  import { useState, useEffect } from 'react';
import { FaTrophy, FaStar, FaMedal, FaFire, FaCrown, FaAward } from 'react-icons/fa';
import { getUserStats } from '../services/api';

/**
 * Gamification System - Feature #25
 * Points, badges, leaderboard for user engagement - FULLY DYNAMIC
 */
function GamificationPage({ user }) {
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    badges: [],
    streak: 0,
    totalReviews: 0,
    totalSearches: 0,
    categoriesExplored: []
  });
  const [loading, setLoading] = useState(true);

  const badges = [
    { id: 'first_search', name: 'First Steps', description: 'Complete your first search', icon: FaStar, requirement: 'searches', value: 1, points: 10 },
    { id: 'search_master', name: 'Search Master', description: 'Complete 50 searches', icon: FaTrophy, requirement: 'searches', value: 50, points: 100 },
    { id: 'reviewer', name: 'Helpful Reviewer', description: 'Leave 10 reviews', icon: FaMedal, requirement: 'reviews', value: 10, points: 50 },
    { id: 'streak_week', name: '7-Day Streak', description: 'Use app 7 days in a row', icon: FaFire, requirement: 'streak', value: 7, points: 75 },
    { id: 'explorer', name: 'Category Explorer', description: 'Try all 8 categories', icon: FaCrown, requirement: 'categories', value: 8, points: 150 },
    { id: 'vip', name: 'VIP User', description: 'Reach level 10', icon: FaAward, requirement: 'level', value: 10, points: 200 }
  ];

  useEffect(() => {
    loadStats();
    checkDailyVisit();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch real stats from backend
      const backendStats = await getUserStats(user.uid);

      // Load local gamification data
      const saved = localStorage.getItem(`gamification_${user?.uid}`);
      const localData = saved ? JSON.parse(saved) : {};

      // Merge backend stats with local gamification data
      const mergedStats = {
        points: localData.points || backendStats.totalSearches * 10,
        level: localData.level || Math.floor((backendStats.totalSearches * 10) / 100) + 1,
        badges: localData.badges || [],
        streak: localData.streak || 0,
        totalReviews: localData.totalReviews || 0,
        totalSearches: backendStats.totalSearches || 0,
        categoriesExplored: backendStats.categoriesExplored || []
      };

      setUserStats(mergedStats);

      // Check for new badges
      checkNewBadges(mergedStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkNewBadges = (stats) => {
    // Auto-award badges based on backend stats
    const newBadges = [...stats.badges];
    let newPoints = stats.points;

    badges.forEach(badge => {
      if (!newBadges.includes(badge.id)) {
        let eligible = false;

        switch (badge.requirement) {
          case 'searches':
            eligible = stats.totalSearches >= badge.value;
            break;
          case 'categories':
            eligible = stats.categoriesExplored.length >= badge.value;
            break;
          case 'streak':
            eligible = stats.streak >= badge.value;
            break;
          case 'level':
            eligible = stats.level >= badge.value;
            break;
          case 'reviews':
            eligible = stats.totalReviews >= badge.value;
            break;
        }

        if (eligible) {
          newBadges.push(badge.id);
          newPoints += badge.points;

          // Show notification for new badge
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🏆 New Badge Earned!', {
              body: `${badge.name}: ${badge.description}`
            });
          }
        }
      }
    });

    if (newBadges.length !== stats.badges.length) {
      const updatedStats = {
        ...stats,
        badges: newBadges,
        points: newPoints,
        level: Math.floor(newPoints / 100) + 1
      };
      setUserStats(updatedStats);
      localStorage.setItem(`gamification_${user?.uid}`, JSON.stringify(updatedStats));
    }
  };

  const checkDailyVisit = () => {
    try {
      const lastVisit = localStorage.getItem(`lastVisit_${user?.uid}`);
      const today = new Date().toDateString();

      if (lastVisit !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const stats = { ...userStats };
        if (lastVisit === yesterday.toDateString()) {
          stats.streak += 1;
        } else if (lastVisit) {
          stats.streak = 1;
        }

        localStorage.setItem(`lastVisit_${user?.uid}`, today);
        updateStats(stats);
      }
    } catch (error) {
      console.error('Error checking daily visit:', error);
    }
  };

  const updateStats = (newStats) => {
    setUserStats(newStats);
    localStorage.setItem(`gamification_${user?.uid}`, JSON.stringify(newStats));
  };

  const addPoints = (points, reason) => {
    const newPoints = userStats.points + points;
    const newLevel = Math.floor(newPoints / 100) + 1;

    updateStats({
      ...userStats,
      points: newPoints,
      level: newLevel
    });

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 Points Earned!', {
        body: `+${points} points for ${reason}`
      });
    }
  };

  const hasBadge = (badgeId) => {
    return userStats.badges.includes(badgeId);
  };

  const checkBadgeEligibility = (badge) => {
    switch (badge.requirement) {
      case 'searches':
        return userStats.totalSearches >= badge.value;
      case 'reviews':
        return userStats.totalReviews >= badge.value;
      case 'streak':
        return userStats.streak >= badge.value;
      case 'categories':
        return userStats.categoriesExplored.length >= badge.value;
      case 'level':
        return userStats.level >= badge.value;
      default:
        return false;
    }
  };

  const claimBadge = (badge) => {
    if (!hasBadge(badge.id) && checkBadgeEligibility(badge)) {
      const newStats = {
        ...userStats,
        badges: [...userStats.badges, badge.id],
        points: userStats.points + badge.points
      };
      updateStats(newStats);
      alert(`🎉 Badge Unlocked: ${badge.name}! +${badge.points} points`);
    }
  };

  const getProgressPercentage = (badge) => {
    let current = 0;
    switch (badge.requirement) {
      case 'searches':
        current = userStats.totalSearches;
        break;
      case 'reviews':
        current = userStats.totalReviews;
        break;
      case 'streak':
        current = userStats.streak;
        break;
      case 'categories':
        current = userStats.categoriesExplored.length;
        break;
      case 'level':
        current = userStats.level;
        break;
    }
    return Math.min((current / badge.value) * 100, 100);
  };

  const pointsToNextLevel = () => {
    return (userStats.level * 100) - userStats.points;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg shadow-lg p-8 mb-8 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <FaTrophy className="text-yellow-300" />
                Your Achievements
              </h1>
              <p className="text-slate-300">Keep earning points and unlocking badges!</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{userStats.points}</div>
              <div className="text-slate-400">Total Points</div>
            </div>
          </div>
        </div>

        {/* Level & Progress */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <FaCrown className="text-white text-2xl" />
              </div>
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Current Level</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">Level {userStats.level}</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 transition-colors duration-200">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
                style={{ width: `${((userStats.points % 100) / 100) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{pointsToNextLevel()} points to level {userStats.level + 1}</p>
          </div>

          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <FaFire className="text-white text-2xl" />
              </div>
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Current Streak</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.streak} Days</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Keep coming back daily to maintain your streak!</p>
          </div>

          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaMedal className="text-white text-2xl" />
              </div>
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Badges Earned</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.badges.length}/{badges.length}</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Unlock all badges to become a master!</p>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-200">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Available Badges</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {badges.map((badge) => {
              const Icon = badge.icon;
              const earned = hasBadge(badge.id);
              const eligible = checkBadgeEligibility(badge);
              const progress = getProgressPercentage(badge);

              return (
                <div
                  key={badge.id}
                  className={`border-2 rounded-lg p-6 transition duration-200 ${earned
                    ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                    : eligible
                      ? 'border-gray-400 dark:border-slate-500 bg-gray-50 dark:bg-slate-800'
                      : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${earned ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-200 dark:bg-slate-700'
                      }`}>
                      <Icon className={`text-3xl ${earned ? 'text-white' : 'text-gray-400 dark:text-slate-500'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{badge.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{badge.description}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-2">+{badge.points} points</p>

                      {!earned && (
                        <>
                          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-2 transition-colors duration-200">
                            <div
                              className="bg-slate-900 dark:bg-white h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{progress.toFixed(0)}% Complete</p>
                        </>
                      )}

                      {earned && (
                        <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          ✓ Earned
                        </span>
                      )}

                      {!earned && eligible && (
                        <button
                          onClick={() => claimBadge(badge)}
                          className="mt-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-md hover:bg-black dark:hover:bg-slate-600 transition font-semibold text-sm"
                        >
                          Claim Badge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export functions for use in other components
export const addGamePoints = (user, points, reason) => {
  try {
    const saved = localStorage.getItem(`gamification_${user?.uid}`);
    const stats = saved ? JSON.parse(saved) : {
      points: 0,
      level: 1,
      badges: [],
      streak: 0,
      totalReviews: 0,
      totalSearches: 0
    };

    stats.points += points;
    stats.level = Math.floor(stats.points / 100) + 1;

    switch (reason) {
      case 'search':
        stats.totalSearches += 1;
        break;
      case 'review':
        stats.totalReviews += 1;
        break;
    }

    localStorage.setItem(`gamification_${user?.uid}`, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error('Error adding points:', error);
    return false;
  }
};

export default GamificationPage;
