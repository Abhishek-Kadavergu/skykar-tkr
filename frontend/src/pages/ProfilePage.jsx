import { FaUser, FaEnvelope, FaCalendar, FaCheckCircle, FaMoon, FaSun } from 'react-icons/fa';
import DarkModeToggle from '../components/DarkModeToggle';

function ProfilePage({ user }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-6 transition-colors duration-200">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            <FaUser className="inline mr-2" />
            Your Profile
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-6 transition-colors duration-200">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Account Information</h2>

          <div className="space-y-6">
            {/* Display Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                <FaUser className="text-lg text-slate-700 dark:text-slate-300" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                  Display Name
                </label>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                <FaEnvelope className="text-lg text-slate-700 dark:text-slate-300" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                  Email Address
                </label>
                <p className="text-base font-medium text-slate-900 dark:text-white">{user?.email}</p>
                {user?.emailVerified && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <FaCheckCircle className="text-green-500 text-xs" />
                    <span className="text-xs text-green-600">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                <FaCalendar className="text-lg text-slate-700 dark:text-slate-300" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                  Member Since
                </label>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                    : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Last Sign In */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                <FaCalendar className="text-lg text-slate-700 dark:text-slate-300" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                  Last Sign In
                </label>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {user?.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Dark Mode Toggle - Mobile Only */}
            <div className="flex items-center gap-3 md:hidden">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                <FaMoon className="text-lg text-slate-700 dark:text-slate-300 hidden dark:block" />
                <FaSun className="text-lg text-slate-700 dark:text-slate-300 block dark:hidden" />
              </div>
              <div className="flex-1 flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Dark Mode
                </label>
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-6 transition-colors duration-200">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Activity</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors duration-200">
              <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">0</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Searches</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors duration-200">
              <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">0</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Viewed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors duration-200">
              <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">0</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Saved</div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors duration-200">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Saved Preferences</h2>
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6 text-center border border-gray-200 dark:border-slate-700 transition-colors duration-200">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Your preferences are automatically saved when you search
            </p>
            <a
              href="/recommendations"
              className="inline-block px-6 py-2.5 bg-slate-800 dark:bg-slate-700 text-white text-sm font-semibold rounded-md hover:bg-slate-900 dark:hover:bg-slate-600 transition-all"
            >
              Update Preferences
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
