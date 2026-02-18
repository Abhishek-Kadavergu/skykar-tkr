import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PreferenceForm from "../components/PreferenceForm";
import RecommendationList from "../components/RecommendationList";
import { saveUserPreferences, getRecommendations } from "../services/api";
import { useGeolocation } from "../utils/useGeolocation";
import products from "../data/products";
import { getRecommendations as getLocalRecommendations } from "../utils/recommendationEngine";

function RecommendationsPage({ user }) {
  const navigate = useNavigate();
  const [showPreferences, setShowPreferences] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [saving, setSaving] = useState(false);
  
  // Get user's location for restaurant and location-based recommendations
  const { location, error: locationError, loading: locationLoading } = useGeolocation();

  const handlePreferencesSubmit = async (userData) => {
    setSaving(true);
    setUserPreferences(userData);

    try {
      let recs = [];

      // Try backend first
      if (user) {
        try {
          console.log("Saving preferences to Backend for user:", user.uid);
          const payload = { ...userData, uid: user.uid };
          await saveUserPreferences(payload);
          console.log("Preferences saved successfully to backend");

          console.log("Fetching recommendations from Backend...");
          if (location) {
            console.log("Using location:", location.lat, location.lng);
          }
          recs = await getRecommendations(user.uid, location);
          console.log("Fetched recommendations from backend:", recs.length);
        } catch (backendError) {
          console.warn("Backend error, falling back to local engine:", backendError.message);
        }
      }

      // Fallback to local recommendation engine if backend returned 0
      if (recs.length === 0) {
        console.log("Using local recommendation engine as fallback...");
        recs = getLocalRecommendations(userData, products);
        console.log("Local recommendations generated:", recs.length);
      }

      setRecommendations(recs);
      setShowPreferences(false);
    } catch (error) {
      console.error("Error in handlePreferencesSubmit:", error);
      // Final fallback: local engine only
      try {
        const localRecs = getLocalRecommendations(userData, products);
        setRecommendations(localRecs);
        setShowPreferences(false);
      } catch (e) {
        alert("Failed to generate recommendations. Please try again.");
      }
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
    navigate("/");
  };

  if (saving) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">
            Generating your personalized recommendations...
          </p>
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
