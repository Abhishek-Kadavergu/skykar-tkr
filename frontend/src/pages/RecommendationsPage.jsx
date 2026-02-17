import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PreferenceForm from "../components/PreferenceForm";
import RecommendationList from "../components/RecommendationList";
import { saveUserPreferences, getRecommendations } from "../services/api";
import products from "../data/products";

function RecommendationsPage({ user }) {
  const navigate = useNavigate();
  const [showPreferences, setShowPreferences] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [saving, setSaving] = useState(false);

  const handlePreferencesSubmit = async (userData) => {
    setSaving(true);
    setUserPreferences(userData);

    try {
      // Save preferences to Backend
      if (user) {
        console.log("Saving preferences to Backend for user:", user.uid);
        const payload = {
          ...userData,
          uid: user.uid
        };
        await saveUserPreferences(payload);
        console.log("Preferences saved successfully to backend");
      }

      // Fetch recommendations from Backend
      console.log("Fetching recommendations from Backend...");
      const recs = await getRecommendations(user.uid);
      setRecommendations(recs);
      console.log("Fetched recommendations:", recs.length);

      setShowPreferences(false);
    } catch (error) {
      console.error("Error in handlePreferencesSubmit:", error);
      // If backend fails, we could fallback, but for now clearer to show empty or error
      // setRecommendations([]); 
      // setShowPreferences(false);
      alert("Failed to generate recommendations. Please try again.");
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
