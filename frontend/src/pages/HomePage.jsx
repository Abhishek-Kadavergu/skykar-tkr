import { Link } from 'react-router-dom';
import { FaRocket, FaHistory, FaUser, FaChartLine, FaTshirt, FaLaptop, FaMusic, FaPalette } from 'react-icons/fa';

function HomePage({ user }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-xl text-slate-600">
            Ready to discover amazing products tailored just for you?
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Get Recommendations */}
          <Link
            to="/recommendations"
            className="bg-slate-800 rounded-lg p-8 text-white hover:bg-slate-900 transition-all transform hover:scale-105 shadow-sm"
          >
            <FaRocket className="text-4xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">Get Recommendations</h2>
            <p className="text-slate-300">
              Tell us your preferences and get personalized product suggestions
            </p>
          </Link>

          {/* View History */}
          <Link
            to="/history"
            className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all transform hover:scale-105"
          >
            <FaHistory className="text-4xl text-slate-700 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">View History</h2>
            <p className="text-slate-600">
              Browse your past recommendations and saved preferences
            </p>
          </Link>

          {/* Profile */}
          <Link
            to="/profile"
            className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all transform hover:scale-105"
          >
            <FaUser className="text-4xl text-slate-700 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Profile</h2>
            <p className="text-slate-600">
              Manage your account settings and saved information
            </p>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FaChartLine />
            Your Activity
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-4xl font-bold text-slate-800 mb-2">0</div>
              <div className="text-slate-600 font-medium">Total Searches</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-4xl font-bold text-slate-800 mb-2">0</div>
              <div className="text-slate-600 font-medium">Products Viewed</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-4xl font-bold text-slate-800 mb-2">0</div>
              <div className="text-slate-600 font-medium">Saved Favorites</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-4xl font-bold text-slate-800 mb-2">0</div>
              <div className="text-slate-600 font-medium">Categories Explored</div>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Popular Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                <FaTshirt className="text-2xl text-slate-700" />
              </div>
              <h4 className="font-semibold text-slate-900">Shoes</h4>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                <FaLaptop className="text-2xl text-slate-700" />
              </div>
              <h4 className="font-semibold text-slate-900">Tech</h4>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                <FaMusic className="text-2xl text-slate-700" />
              </div>
              <h4 className="font-semibold text-slate-900">Music</h4>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                <FaPalette className="text-2xl text-slate-700" />
              </div>
              <h4 className="font-semibold text-slate-900">Hobbies</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
