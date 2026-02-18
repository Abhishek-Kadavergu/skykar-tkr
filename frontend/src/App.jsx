import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth, logOut } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import FloatingChatButton from './components/FloatingChatButton';
import NavigationTour from './components/NavigationTour';
import LandingPage from './pages/LandingPage';
import HorizonLandingPage from './pages/HorizonLandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RecommendationsPage from './pages/RecommendationsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AIAssistantPage from './pages/AIAssistantPage';
import FavoritesPage from './pages/FavoritesPage';
import ComparisonPage from './pages/ComparisonPage';
import BudgetTrackerPage from './pages/BudgetTrackerPage';
import PriceAlertsPage from './pages/PriceAlertsPage';
import GamificationPage from './pages/GamificationPage';

// Wrapper to conditionally show floating chat button
function AppContent({ user, handleLogout }) {
  const location = useLocation();
  const hideFloatingChatRoutes = ['/ai-assistant'];
  const showFloatingChat = user && !hideFloatingChatRoutes.includes(location.pathname);

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <div className="pb-20 md:pb-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!user ? <HorizonLandingPage /> : <Navigate to="/home" />} />
          <Route path="/login" element={!user ? <LoginPage onLoginSuccess={() => { }} /> : <Navigate to="/home" />} />

          {/* Protected Routes */}
          <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/login" />} />
          <Route path="/recommendations" element={user ? <RecommendationsPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/history" element={user ? <HistoryPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />
          <Route path="/ai-assistant" element={user ? <AIAssistantPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/favorites" element={user ? <FavoritesPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/comparison" element={user ? <ComparisonPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/budget-tracker" element={user ? <BudgetTrackerPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/price-alerts" element={user ? <PriceAlertsPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/achievements" element={user ? <GamificationPage user={user} /> : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Mobile Bottom Navigation Dock */}
      {user && <MobileBottomNav user={user} />}

      {/* Floating AI Chat Button - Hidden on AI Assistant page */}
      {showFloatingChat && <FloatingChatButton user={user} />}

      {/* Navigation Tour - Onboarding guide for new users */}
      {user && <NavigationTour user={user} />}
    </>
  );
}

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-800 dark:border-white mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DarkModeProvider>
      <Router>
        <AppContent user={user} handleLogout={handleLogout} />
      </Router>
    </DarkModeProvider>
  );
}

export default App;
