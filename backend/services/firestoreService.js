import { getDb, FieldValue, Timestamp } from '../config/firebase.js';

/**
 * Firestore Service Layer
 * Handles all database operations with the new structure
 */

class FirestoreService {
  constructor() {
    this.db = null;
  }

  /**
   * Get Firestore instance
   */
  getFirestore() {
    if (!this.db) {
      this.db = getDb();
    }
    return this.db;
  }

  /**
   * Get user document reference
   */
  getUserRef(userId) {
    const db = this.getFirestore();
    return db.collection('users').doc(userId);
  }

  /**
   * Create or update user profile
   */
  async createUser(userId, userData) {
    try {
      const userRef = this.getUserRef(userId);
      const userDoc = {
        uid: userId,
        name: userData.name || '',
        email: userData.email || '',
        displayName: userData.displayName || '',
        photoURL: userData.photoURL || '',
        preferences: [],
        recommendationHistory: [],
        favorites: [],
        viewedProducts: [],
        stats: {
          totalSearches: 0,
          productsViewed: 0,
          categoriesExplored: []
        },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      await userRef.set(userDoc, { merge: true });
      return userDoc;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get user document
   */
  async getUser(userId) {
    try {
      const userRef = this.getUserRef(userId);
      const doc = await userRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  /**
   * Add preference to user
   */
  async addPreference(userId, preference) {
    try {
      const userRef = this.getUserRef(userId);
      
      const newPreference = {
        id: `pref_${Date.now()}`,
        category: preference.category,
        brands: preference.brands || [],
        budget: preference.budget,
        featurePreference: preference.featurePreference,
        ratingImportance: preference.ratingImportance || 3,
        budgetImportance: preference.budgetImportance || 3,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      await userRef.update({
        preferences: FieldValue.arrayUnion(newPreference),
        updatedAt: FieldValue.serverTimestamp()
      });

      return newPreference;
    } catch (error) {
      console.error('Error adding preference:', error);
      throw error;
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(userId) {
    try {
      const user = await this.getUser(userId);
      return user?.preferences || [];
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  }

  /**
   * Update user preferences (replace entire array)
   */
  async updatePreferences(userId, preferences) {
    try {
      const userRef = this.getUserRef(userId);
      
      // Use set with merge to handle case where document doesn't exist
      await userRef.set({
        preferences: preferences,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });

      return preferences;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Save recommendation to history
   */
  async saveRecommendation(userId, recommendation) {
    try {
      const userRef = this.getUserRef(userId);
      const user = await this.getUser(userId);

      const newRecommendation = {
        id: `rec_${Date.now()}`,
        category: recommendation.category,
        products: recommendation.products || [],
        generatedAt: new Date().toISOString() // Use regular timestamp instead of serverTimestamp
      };

      // Keep only last 10 recommendations
      let history = user?.recommendationHistory || [];
      history.unshift(newRecommendation);
      if (history.length > 10) {
        history = history.slice(0, 10);
      }

      await userRef.update({
        recommendationHistory: history,
        lastRecommendation: recommendation.products?.[0] || null,
        updatedAt: FieldValue.serverTimestamp()
      });

      return newRecommendation;
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw error;
    }
  }

  /**
   * Get recommendation history
   */
  async getRecommendationHistory(userId) {
    try {
      const user = await this.getUser(userId);
      return user?.recommendationHistory || [];
    } catch (error) {
      console.error('Error getting recommendation history:', error);
      throw error;
    }
  }

  /**
   * Add to favorites
   */
  async addToFavorites(userId, productId) {
    try {
      const userRef = this.getUserRef(userId);
      
      await userRef.update({
        favorites: FieldValue.arrayUnion(productId),
        updatedAt: FieldValue.serverTimestamp()
      });

      return { success: true, productId };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  /**
   * Remove from favorites
   */
  async removeFromFavorites(userId, productId) {
    try {
      const userRef = this.getUserRef(userId);
      
      await userRef.update({
        favorites: FieldValue.arrayRemove(productId),
        updatedAt: FieldValue.serverTimestamp()
      });

      return { success: true, productId };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  /**
   * Get favorites
   */
  async getFavorites(userId) {
    try {
      const user = await this.getUser(userId);
      return user?.favorites || [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
  }

  /**
   * Track product view
   */
  async trackProductView(userId, productId) {
    try {
      const userRef = this.getUserRef(userId);
      const user = await this.getUser(userId);

      // Keep only last 50 viewed products
      let viewedProducts = user?.viewedProducts || [];
      viewedProducts.unshift(productId);
      viewedProducts = [...new Set(viewedProducts)]; // Remove duplicates
      if (viewedProducts.length > 50) {
        viewedProducts = viewedProducts.slice(0, 50);
      }

      await userRef.update({
        viewedProducts: viewedProducts,
        'stats.productsViewed': FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error tracking product view:', error);
      throw error;
    }
  }

  /**
   * Update stats
   */
  async updateStats(userId, statsUpdate) {
    try {
      const userRef = this.getUserRef(userId);
      const updateData = { updatedAt: FieldValue.serverTimestamp() };

      if (statsUpdate.totalSearches) {
        updateData['stats.totalSearches'] = FieldValue.increment(statsUpdate.totalSearches);
      }
      
      if (statsUpdate.categoriesExplored) {
        const user = await this.getUser(userId);
        const categories = user?.stats?.categoriesExplored || [];
        const updatedCategories = [...new Set([...categories, ...statsUpdate.categoriesExplored])];
        updateData['stats.categoriesExplored'] = updatedCategories;
      }

      await userRef.update(updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  }

  /**
   * Get user stats
   */
  async getStats(userId) {
    try {
      const user = await this.getUser(userId);
      return user?.stats || {
        totalSearches: 0,
        productsViewed: 0,
        categoriesExplored: []
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }
}

export default new FirestoreService();
