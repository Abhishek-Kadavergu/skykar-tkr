import { FaUser, FaEnvelope, FaCalendar, FaCheckCircle } from 'react-icons/fa';

function ProfilePage({ user }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            <FaUser className="inline mr-3" />
            Your Profile
          </h1>
          <p className="text-slate-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Information</h2>
          
          <div className="space-y-6">
            {/* Display Name */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaUser className="text-xl text-slate-700" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Display Name
                </label>
                <p className="text-lg text-slate-900">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-xl text-slate-700" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <p className="text-lg text-slate-900">{user?.email}</p>
                {user?.emailVerified && (
                  <div className="flex items-center gap-2 mt-1">
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-sm text-green-600">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCalendar className="text-xl text-slate-700" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Member Since
                </label>
                <p className="text-lg text-slate-900">
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
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCalendar className="text-xl text-slate-700" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Last Sign In
                </label>
                <p className="text-lg text-slate-900">
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
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Activity</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-4xl font-bold text-slate-800 mb-2">0</div>
              <div className="text-slate-600">Total Searches</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-4xl font-bold text-slate-800 mb-2">0</div>
              <div className="text-slate-600">Products Viewed</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-4xl font-bold text-slate-800 mb-2">0</div>
              <div className="text-slate-600">Favorites Saved</div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Saved Preferences</h2>
          <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
            <p className="text-slate-600 mb-4">
              Your preferences are automatically saved when you search
            </p>
            <a
              href="/recommendations"
              className="inline-block px-6 py-3 bg-slate-800 text-white font-semibold rounded-md hover:bg-slate-900 transition-all"
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
