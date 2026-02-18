import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.genAI = null;
        this.model = null;
        this.conversationHistories = new Map(); // Store conversation history per user
    }

    /**
     * Initialize Gemini AI
     */
    initialize() {
        if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
            console.warn('⚠️  Gemini API key not configured. AI features will be disabled.');
            return false;
        }

        try {
            this.genAI = new GoogleGenerativeAI(this.apiKey);

            // Using Gemini 2.0 Flash as requested - latest model
            const modelName = 'gemini-2.0-flash';
            this.model = this.genAI.getGenerativeModel({ model: modelName });
            console.log(`Gemini AI initialized successfully ✅ (${modelName})`);
            return true;
        } catch (error) {
            console.error('Error initializing Gemini AI:', error);
            return false;
        }
    }

    /**
     * Check if Gemini is available
     */
    isAvailable() {
        return this.model !== null;
    }

    /**
     * Generate text from prompt
     */
    async generateText(prompt, systemInstruction = null) {
        if (!this.isAvailable()) {
            throw new Error('Gemini AI is not available. Please configure GEMINI_API_KEY in .env file.');
        }

        try {
            const fullPrompt = systemInstruction
                ? `${systemInstruction}\n\n${prompt}`
                : prompt;

            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating text:', error);
            throw error;
        }
    }

    /**
     * Generate product recommendation explanation
     */
    async explainRecommendation(product, preferences) {
        const prompt = `You are an AI shopping assistant for AalayaX. Explain why this product is recommended for the user.

Product Details:
- Name: ${product.name}
- Category: ${product.category}
- Brand: ${product.brand}
- Price: ₹${product.price}
- Rating: ${product.rating}/5
- Description: ${product.description}
- Features: ${product.features?.join(', ') || 'N/A'}

User Preferences:
- Category Interest: ${preferences.category}
- Budget: ₹${preferences.budget}
- Preferred Brands: ${preferences.brands?.join(', ') || 'Any'}
- Feature Preference: ${preferences.featurePreference}
- Rating Importance: ${preferences.ratingImportance}/5
- Budget Importance: ${preferences.budgetImportance}/5

Write a friendly, concise 2-3 sentence explanation of why this product matches the user's preferences. Be specific about the matching factors.`;

        return await this.generateText(prompt);
    }

    /**
     * Start or continue a conversation with FULL user context
     */
    async chat(userId, userMessage, context = {}) {
        if (!this.isAvailable()) {
            return {
                response: "I'm sorry, but the AI assistant is currently unavailable. Please make sure the Gemini API key is configured.",
                error: true
            };
        }

        try {
            // Get or create conversation history for this user
            if (!this.conversationHistories.has(userId)) {
                this.conversationHistories.set(userId, []);
            }

            const history = this.conversationHistories.get(userId);

            // Build RICH context-aware prompt with user data
            const userPreferences = context.preferences && context.preferences.length > 0
                ? context.preferences.map(p => `${p.category}: Budget ₹${p.budget}, Brands: ${p.brands?.join(', ') || 'Any'}`).join('; ')
                : 'No preferences set yet';

            const locationInfo = context.location
                ? `📍 User Location: ${context.location.address || `Lat ${context.location.lat}, Lng ${context.location.lng}`}`
                : '📍 Location: Not available (user needs to enable)';

            const systemContext = `You are **AalayaX AI Assistant** - ${context.userName}'s personal shopping and recommendation assistant.
📅 Current Date: ${context.currentDate}

🎯 CRITICAL: You have FULL ACCESS to user's profile data. Never ask for information you already have!

📊 USER PROFILE:
- Name: ${context.userName}
- Total Searches: ${context.totalSearches || 0}
- Recent Categories: ${context.recentSearches?.join(', ') || 'None'}
- Favorites: ${context.favorites?.length || 0} saved items
- ${locationInfo}

💡 USER PREFERENCES:
${userPreferences}

🛍️ AVAILABLE CATEGORIES:
- **Restaurants** (via Google Places API) - Real-time data, ratings, photos
- **Movies & TV Shows** (via TMDB API) - Latest releases, trailers, reviews
- **Tech**: Smartphones, laptops, tablets, smartwatches
- **Shoes**: Running shoes, casual sneakers, sports shoes
- **Music**: Albums, artists, playlists
- **Watches**: Smart watches, luxury watches
- **Perfumes**: Designer fragrances
- **Other categories** as needed

🎭 YOUR ROLE:
- Use the user's stored preferences automatically - NEVER ask for info you already have
- When I provide REAL data from Google Places or TMDB, present it in a friendly, conversational format
- Maintain clean markdown formatting with **bold names**, emojis (⭐📍💰), and line breaks
- Be specific - use actual restaurant/movie names, ratings, and details I provide
- Add helpful context and recommendations based on the user's preferences
- Be conversational, proactive, and personalized
- Help users discover great options matching their taste

CONVERSATION HISTORY:
${history.slice(-10).map(h => `${h.role}: ${h.content}`).join('\n')}

User: ${userMessage}
Assistant:`;

            const response = await this.generateText(systemContext);

            // Update conversation history (keep last 20 messages)
            history.push({ role: 'user', content: userMessage });
            history.push({ role: 'assistant', content: response });

            if (history.length > 40) {
                history.splice(0, history.length - 40);
            }

            return {
                response,
                error: false,
                conversationId: userId
            };
        } catch (error) {
            console.error('Error in chat:', error);
            return {
                response: "I encountered an error processing your request. Please try again.",
                error: true,
                errorMessage: error.message
            };
        }
    }

    /**
     * Process natural language query for product search
     */
    async processSearchQuery(query, availableProducts) {
        const prompt = `You are a shopping search assistant. Parse this natural language query and extract structured search criteria.

User Query: "${query}"

Available Product Categories: Tech, Shoes, Fashion, Home (but do not make assumption)

Extract and return ONLY a JSON object with these fields (use null if not mentioned):
{
  "category": "category name or null",
  "minPrice": number or null,
  "maxPrice": number or null,
  "brands": ["brand1", "brand2"] or [],
  "keywords": ["keyword1", "keyword2"],
  "intent": "search" | "compare" | "recommend" | "question"
}

Examples:
- "Find Nike shoes under 5000" -> {"category": "Shoes", "maxPrice": 5000, "brands": ["Nike"], "keywords": [], "intent": "search"}
- "Best smartphones with good camera" -> {"category": "Tech", "keywords": ["camera", "smartphone"], "intent": "recommend"}

Return ONLY the JSON object, no other text.`;

        try {
            const response = await this.generateText(prompt);
            const jsonMatch = response.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            // Fallback
            return {
                category: null,
                minPrice: null,
                maxPrice: null,
                brands: [],
                keywords: query.toLowerCase().split(' '),
                intent: 'search'
            };
        } catch (error) {
            console.error('Error processing search query:', error);
            return {
                category: null,
                keywords: query.toLowerCase().split(' '),
                intent: 'search'
            };
        }
    }

    /**
     * Clear conversation history for a user
     */
    clearConversation(userId) {
        this.conversationHistories.delete(userId);
    }

    /**
     * Get conversation history
     */
    getConversationHistory(userId) {
        return this.conversationHistories.get(userId) || [];
    }

    /**
     * Generate intelligent reasoning for recommendation
     */
    async explainWhyRecommended(item, preference, options = {}) {
        if (!this.isAvailable()) {
            return this.generateFallbackReason(item, preference);
        }

        const prompt = `You are AalayaX AI Assistant. Explain in ONE compelling sentence why this item is recommended for the user.

Item: ${item.name}
Category: ${item.category}
${item.price ? `Price: ₹${item.price}` : ''}
${item.rating ? `Rating: ${item.rating}★` : ''}
${item.brand ? `Brand: ${item.brand}` : ''}
${item.source ? `Source: ${item.source}` : ''}

User Preference:
Category: ${preference.category}
${preference.budget ? `Budget: ₹${preference.budget}` : ''}
${preference.featurePreference ? `Looking for: ${preference.featurePreference}` : ''}

Create ONE sentence (max 15 words) explaining why this matches their needs. Be specific and enthusiastic.`;

        try {
            const response = await this.generateText(prompt);
            return response.trim().replace(/["\n]/g, '');
        } catch (error) {
            console.error('Error generating AI reason:', error);
            return this.generateFallbackReason(item, preference);
        }
    }

    /**
     * Fallback reason generator
     */
    generateFallbackReason(item, preference) {
        const reasons = [];

        if (item.rating && item.rating >= 4) {
            reasons.push(`Highly rated at ${item.rating}★`);
        }

        if (preference.budget && item.price && item.price <= preference.budget) {
            reasons.push('fits your budget');
        }

        if (item.source === 'google_places') {
            reasons.push('nearby location');
        }

        if (reasons.length === 0) {
            reasons.push(`matches your interest in ${item.category}`);
        }

        return `Recommended because it ${reasons.join(' and ')}.`;
    }

    /**
     * Compare multiple items and provide insights
     */
    async compareItems(items, context = {}) {
        if (!this.isAvailable() || items.length < 2) {
            return null;
        }

        const itemsList = items.slice(0, 3).map((item, i) =>
            `${i + 1}. ${item.name} - ${item.category} - ${item.price ? `₹${item.price}` : 'Free'} - ${item.rating}★`
        ).join('\n');

        const prompt = `Compare these items and give 3 quick insights (each max 10 words):

${itemsList}

${context.budget ? `User Budget: ₹${context.budget}` : ''}

Provide exactly 3 bullet points:
• Best value:
• Best rated:
• Best for:`;

        try {
            const response = await this.generateText(prompt);
            return response.trim();
        } catch (error) {
            console.error('Error comparing items:', error);
            return null;
        }
    }

    /**
     * Generate context-aware recommendations summary
     */
    async generateRecommendationSummary(recommendations, userContext) {
        if (!this.isAvailable() || recommendations.length === 0) {
            return `Found ${recommendations.length} recommendations for you.`;
        }

        const sources = [...new Set(recommendations.map(r => r.source))].join(', ');
        const categories = [...new Set(recommendations.map(r => r.category))].join(', ');

        const prompt = `Generate ONE enthusiastic sentence (max 20 words) summarizing these recommendations:

Count: ${recommendations.length}
Categories: ${categories}
Sources: ${sources}
${userContext.location ? 'Including nearby locations' : ''}

Make it engaging and personal!`;

        try {
            const response = await this.generateText(prompt);
            return response.trim().replace(/["\n]/g, '');
        } catch (error) {
            return `Found ${recommendations.length} personalized recommendations across ${categories}.`;
        }
    }

    /**
     * Save conversation message to history (helper for external calls)
     */
    saveConversationMessage(userId, userMessage, assistantResponse) {
        if (!this.conversationHistories.has(userId)) {
            this.conversationHistories.set(userId, []);
        }

        const history = this.conversationHistories.get(userId);
        history.push({ role: 'user', content: userMessage });
        history.push({ role: 'assistant', content: assistantResponse });

        // Keep last 40 messages
        if (history.length > 40) {
            history.splice(0, history.length - 40);
        }
    }

    /**
     * Clear conversation history for a user
     */
    clearConversation(userId) {
        this.conversationHistories.delete(userId);
    }
}

export default new GeminiService();
