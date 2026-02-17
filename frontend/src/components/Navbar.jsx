import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaHistory, FaSignOutAlt, FaThLarge } from 'react-icons/fa';

function Navbar({ user, onLogout }) {
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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center">
              <FaThLarge className="text-white text-sm" />
            </div>
            <span className="text-2xl font-bold text-slate-800">
              AalayaX
            </span>
          </Link>

          {/* Navigation Links */}
          {user ? (
            <div className="flex items-center gap-6">
              <Link
                to="/home"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                <FaHome className="text-lg" />
                <span>Home</span>
              </Link>
              <Link
                to="/recommendations"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                <FaThLarge className="text-lg" />
                <span>Recommendations</span>
              </Link>
              <Link
                to="/history"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                <FaHistory className="text-lg" />
                <span>History</span>
              </Link>
              
              {/* Profile Picture and Logout */}
              <div className="flex items-center gap-3 ml-2 pl-6 border-l border-gray-300">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-9 h-9 rounded-full border-2 border-slate-300 object-cover"
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
    </nav>
  );
}

export default Navbar;
