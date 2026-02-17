import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, logOut } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RecommendationsPage from './pages/RecommendationsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser?.email);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (user) => {
    console.log('Login successful:', user.email);
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/home" />} />
          <Route path="/login" element={!user ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/home" />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/login" />} />
          <Route path="/recommendations" element={user ? <RecommendationsPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/history" element={user ? <HistoryPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
