import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaChartLine, FaShieldAlt, FaUtensils, FaFilm, FaMusic, FaShoppingBag, FaLaptop, FaClock, FaVial, FaTv } from 'react-icons/fa';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-slate-900 mb-6">
            Welcome to <span className="text-slate-800">AalayaX</span>
          </h1>
          <p className="text-2xl text-slate-600 mb-8 max-w-3xl mx-auto font-medium">
            AI-Powered Virtual Assistance & User Experience Engine
          </p>
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto">
            Get personalized recommendations for restaurants, movies, music, shoes, tech, watches, perfumes, and TV devices.
            Our intelligent AI engine finds the perfect match for you.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-slate-800 text-white text-lg font-semibold rounded-md hover:bg-slate-900 transition-all shadow-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <FaSearch className="text-2xl text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Search</h3>
            <p className="text-slate-600 leading-relaxed">
              Advanced AI algorithm analyzes your preferences to find the best products across multiple categories.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <FaStar className="text-2xl text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Personalized</h3>
            <p className="text-slate-600 leading-relaxed">
              Every recommendation is tailored to your unique interests, budget, and feature preferences.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <FaChartLine className="text-2xl text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Match Scores</h3>
            <p className="text-slate-600 leading-relaxed">
              See exactly how well each product matches your criteria with detailed breakdown scores.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <FaShieldAlt className="text-2xl text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Fast</h3>
            <p className="text-slate-600 leading-relaxed">
              Your data is protected with Firebase security, and recommendations are generated instantly.
            </p>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-20 bg-white rounded-lg p-12 shadow-sm border border-gray-200">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FaUtensils className="text-3xl text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Restaurants</h3>
              <p className="text-slate-600 text-sm mt-2">Location-based dining</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FaFilm className="text-3xl text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Movies & TV</h3>
              <p className="text-slate-600 text-sm mt-2">Real-time streaming data</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FaMusic className="text-3xl text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Music Albums</h3>
              <p className="text-slate-600 text-sm mt-2">Bollywood, EDM, LoFi & more</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FaShoppingBag className="text-3xl text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Shoes</h3>
              <p className="text-slate-600 text-sm mt-2">Nike, Adidas, Puma & more</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FaLaptop className="text-3xl text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tech</h3>
              <p className="text-slate-600 text-sm mt-2">Smartphones & Laptops</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FaClock className="text-3xl text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Watches</h3>
              <p className="text-slate-600 text-sm mt-2">Smart & Luxury watches</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FaVial className="text-3xl text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Perfumes</h3>
              <p className="text-slate-600 text-sm mt-2">Dior, Gucci, Armani & more</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FaTv className="text-3xl text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">TV Devices</h3>
              <p className="text-slate-600 text-sm mt-2">Sony, Samsung, LG & more</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-slate-900 rounded-lg p-16 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to discover your perfect products?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Join thousands of users finding exactly what they need
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-white text-slate-900 text-lg font-semibold rounded-md hover:bg-gray-100 transition-all shadow-sm"
          >
            Start Exploring Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
