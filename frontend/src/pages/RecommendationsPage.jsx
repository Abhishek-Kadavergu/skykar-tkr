import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PreferenceForm from '../components/PreferenceForm';
import RecommendationList from '../components/RecommendationList';
import { getRecommendations } from '../utils/recommendationEngine';
import { saveUserPreferences, saveRecommendationHistory } from '../services/firebase';
import products from '../data/products';

function RecommendationsPage({ user }) {
  const navigate = useNavigate();
  const [showPreferences, setShowPreferences] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [saving, setSaving] = useState(false);

  const handlePreferencesSubmit = async (preferences) => {
    setSaving(true);
    setUserPreferences(preferences);

    try {
      // Save preferences to Firestore
      if (user) {
        console.log('Saving preferences to Firebase for user:', user.uid);
        const saved = await saveUserPreferences(user.uid, preferences);
        if (saved) {
          console.log('Preferences saved successfully');
        } else {
          console.warn('Failed to save preferences to Firebase');
        }
      }

      // Generate recommendations locally
      console.log('Generating recommendations...');
      const recs = getRecommendations(preferences, products);
      setRecommendations(recs);
      console.log('Generated recommendations:', recs.length);

      // Save recommendation history
      if (user && recs.length > 0) {
        console.log('Saving recommendation history...');
        const historySaved = await saveRecommendationHistory(user.uid, {
          preferences,
          recommendations: recs,
          timestamp: new Date().toISOString()
        });
        if (historySaved) {
          console.log('Recommendation history saved successfully');
        } else {
          console.warn('Failed to save recommendation history');
        }
      }

      setShowPreferences(false);
    } catch (error) {
      console.error('Error in handlePreferencesSubmit:', error);
      // Still show recommendations even if saving fails
      const recs = getRecommendations(preferences, products);
      setRecommendations(recs);
      setShowPreferences(false);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setShowPreferences(true);
    setRecommendations([]);
    setUserPreferences(null);
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (saving) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Generating your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showPreferences ? (
        <PreferenceForm onSubmit={handlePreferencesSubmit} user={user} />
      ) : (
        <RecommendationList
          recommendations={recommendations}
          preferences={userPreferences}
          onReset={handleReset}
          onLogout={handleLogout}
          user={user}
        />
      )}
    </div>
  );
}

export default RecommendationsPage;
