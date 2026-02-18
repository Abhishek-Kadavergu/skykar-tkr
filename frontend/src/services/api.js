// API Service for AalayaX Backend - Complete API integration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ==================== EXPLANATIONS ====================
export const getExplanation = async (preferences, product) => {
  try {
    const response = await fetch(`${API_URL}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences, product }),
    });
    const data = await response.json();
    return data.explanation;
  } catch (error) {
    console.error('Error fetching explanation:', error);
    return `${product.name} matches your preferences for ${preferences.category} with a budget of ₹${preferences.budget}.`;
  }
};

// ==================== PREFERENCES ====================
export const saveUserPreferences = async (userData) => {
  const response = await fetch(`${API_URL}/user-preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return await response.json();
};

// ==================== RECOMMENDATIONS ====================
export const getRecommendations = async (userId, location = null) => {
  let url = `${API_URL}/recommendations/${userId}`;
  if (location) {
    url += `?location=${encodeURIComponent(JSON.stringify(location))}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data.recommendations || [];
};

export const generateRecommendations = async (userId, location = null) => {
  const response = await fetch(`${API_URL}/recommendations/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, location }),
  });
  return await response.json();
};

// ==================== AI CHAT ====================
export const sendChatMessage = async (userId, message, location = null) => {
  try {
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        message: `[Current Date: ${new Date().toLocaleString()}] ${message}`,
        location,
        clientDate: new Date().toString() // Send strictly current client date
      }),
    });
    return await response.json();
  } catch (error) {
    return { response: "Connection error. Please try again.", error: true };
  }
};

export const searchWithAI = async (userId, query) => {
  const response = await fetch(`${API_URL}/ai/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, query }),
  });
  return await response.json();
};

export const getConversationHistory = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/ai/conversation/${userId}`);
    return await response.json();
  } catch {
    return { history: [] };
  }
};

export const clearConversation = async (userId) => {
  await fetch(`${API_URL}/ai/conversation/clear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
};

// ==================== FAVORITES ====================
export const addToFavorites = async (userId, productId) => {
  const response = await fetch(`${API_URL}/user/favorites/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId }),
  });
  return await response.json();
};

export const removeFromFavorites = async (userId, productId) => {
  const response = await fetch(`${API_URL}/user/favorites/remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId }),
  });
  return await response.json();
};

export const getFavorites = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/favorites/${userId}`);
    const data = await response.json();
    return data.favorites || [];
  } catch {
    return [];
  }
};

// ==================== TRACKING ====================
export const trackProductView = async (userId, productId) => {
  try {
    await fetch(`${API_URL}/user/track/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId }),
    });
  } catch (error) {
    console.error('Track view error:', error);
  }
};

// ==================== STATS ====================
export const getUserStats = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/stats/${userId}`);
    const data = await response.json();
    return data.stats || {
      totalSearches: 0,
      productsViewed: 0,
      categoriesExplored: [],
      favoritesCount: 0
    };
  } catch {
    return { totalSearches: 0, productsViewed: 0, categoriesExplored: [], favoritesCount: 0 };
  }
};

export const getUserProfile = async (userId) => {
  const response = await fetch(`${API_URL}/user/profile/${userId}`);
  return await response.json();
};

// ==================== HISTORY ====================
export const getRecommendationHistory = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/recommendations/history/${userId}`);
    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export default {
  getExplanation,
  saveUserPreferences,
  getRecommendations,
  generateRecommendations,
  sendChatMessage,
  searchWithAI,
  getConversationHistory,
  clearConversation,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  trackProductView,
  getUserStats,
  getUserProfile,
  getRecommendationHistory
};
