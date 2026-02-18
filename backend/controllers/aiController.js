import geminiService from '../services/geminiService.js';
import firestoreService from '../services/firestoreService.js';
import dataSourceManager from '../services/dataSourceManager.js';
import products from '../data/products.js';

/**
 * Chat with AI Assistant - ENHANCED with real data access
 */
export const chat = async (req, res) => {
    try {
        const { userId, message, location, clientDate, detectedLanguage } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ message: 'User ID and message are required' });
        }

        // Get comprehensive user context
        const user = await firestoreService.getUser(userId);
        const favorites = await firestoreService.getFavorites(userId);
        const stats = await firestoreService.getStats(userId);
        const recommendationHistory = await firestoreService.getRecommendationHistory(userId);

        // Build rich context including location
        const context = {
            preferences: user?.preferences || [],
            favorites: favorites || [],
            recentSearches: stats?.categoriesExplored || [],
            totalSearches: stats?.totalSearches || 0,
            location: location || user?.location || null,
            userName: user?.displayName || user?.email?.split('@')[0] || 'User',
            currentDate: clientDate || new Date().toLocaleString()
        };

        // Detect if user is asking for location-based recommendations (restaurants, places, food)
        // Include common food types: biryani, pizza, burger, sushi, chinese, italian, etc.
        const isRestaurantQuery = /restaurant|food|cafe|dining|eat|near|nearby|biryani|pizza|burger|sushi|chinese|italian|mexican|indian|thai|japanese|korean|vietnamese|fast food|breakfast|lunch|dinner|brunch|dessert|bakery|bar|pub|cuisine/i.test(message);

        // If asking about restaurants/food and we have location, fetch REAL data
        if (isRestaurantQuery && context.location) {
            console.log('🍽️  Restaurant query detected with location, fetching real data...');

            try {
                // Extract cuisine/food type from message (biryani, pizza, chinese, etc.)
                const cuisineTypes = {
                    'biryani': 'biryani',
                    'pizza': 'pizza',
                    'burger': 'burger',
                    'sushi': 'sushi',
                    'chinese': 'chinese',
                    'italian': 'italian',
                    'mexican': 'mexican',
                    'indian': 'indian',
                    'thai': 'thai',
                    'japanese': 'japanese',
                    'korean': 'korean',
                    'vietnamese': 'vietnamese',
                    'fast food': 'fast food',
                    'breakfast': 'breakfast',
                    'lunch': 'lunch',
                    'dinner': 'dinner',
                    'dessert': 'dessert',
                    'bakery': 'bakery',
                    'cafe': 'cafe',
                    'coffee': 'coffee'
                };

                let cuisinePreference = '';
                for (const [key, value] of Object.entries(cuisineTypes)) {
                    if (message.toLowerCase().includes(key)) {
                        cuisinePreference = value;
                        break;
                    }
                }

                console.log(`🔍 Searching for: ${cuisinePreference || 'restaurants'} near ${context.location.lat}, ${context.location.lng}`);

                // Get real restaurant recommendations from Google Places
                const recommendations = await dataSourceManager.getRecommendations({
                    userId,
                    preferences: [{
                        category: 'restaurant',
                        budget: context.preferences[0]?.budget || 2000,
                        brands: [],
                        featurePreference: cuisinePreference || 'restaurant'
                    }],
                    location: context.location
                });

                console.log(`✅ Got ${recommendations.length} real restaurants from Google Places API`);

                if (recommendations.length === 0) {
                    // If no results, let AI handle it
                    const result = await geminiService.chat(userId, message, context, detectedLanguage);
                    return res.status(200).json(result);
                }

                // Format restaurant data beautifully for AI
                const topRestaurants = recommendations.slice(0, 8);
                const formattedList = topRestaurants.map((r, i) => {
                    const stars = '⭐'.repeat(Math.round(r.rating));
                    const priceSymbol = '₹'.repeat(r.priceLevel || 2);
                    const openStatus = r.isOpen === true ? '🟢 Open Now' : r.isOpen === false ? '🔴 Closed' : '';

                    return `${i + 1}. **${r.name}**
   ${stars} ${r.rating}/5 (${r.totalRatings?.toLocaleString() || 0} reviews)
   📍 ${r.address}
   💰 Price Level: ${priceSymbol}
   ${openStatus}`;
                }).join('\n\n');

                const locationName = context.location.address || `your location (${context.location.lat}, ${context.location.lng})`;
                const cuisineText = cuisinePreference ? `${cuisinePreference} restaurants` : 'restaurants';

                // Create a natural prompt with pre-formatted data
                const enhancedMessage = `The user asked: "${message}"

I found these REAL ${cuisineText} near ${locationName} using Google Places API:

${formattedList}

Please present these restaurants in a friendly, conversational way. Keep the formatting clean with the restaurant names, ratings, and addresses. Add helpful context based on the user's preferences (budget: ₹${context.preferences[0]?.budget || 2000}). Be specific and use the actual restaurant names and details provided.`;

                const result = await geminiService.chat(userId, enhancedMessage, context, detectedLanguage);

                // Attach full recommendations to response
                result.recommendations = topRestaurants;
                result.hasRealData = true;

                // Store in conversation history (without raw data)
                await geminiService.saveConversationMessage(userId, message, result.response);

                return res.status(200).json(result);
            } catch (error) {
                console.error('Error fetching real restaurant data:', error);
                // Fall back to AI-only response if API fails
            }
        }

        // For non-restaurant queries or when no location, use standard AI chat
        const result = await geminiService.chat(userId, message, context, detectedLanguage);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in AI chat:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            response: "I'm having trouble connecting right now. Please try again."
        });
    }
};

/**
 * Process natural language search query
 */
export const processSearch = async (req, res) => {
    try {
        const { userId, query } = req.body;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Parse query with AI
        const parsedQuery = await geminiService.processSearchQuery(query, products);

        // Filter products based on parsed query
        let results = products;

        if (parsedQuery.category) {
            results = results.filter(p =>
                p.category.toLowerCase() === parsedQuery.category.toLowerCase()
            );
        }

        if (parsedQuery.brands && parsedQuery.brands.length > 0) {
            results = results.filter(p =>
                parsedQuery.brands.some(b => b.toLowerCase() === p.brand.toLowerCase())
            );
        }

        if (parsedQuery.maxPrice) {
            results = results.filter(p => p.price <= parsedQuery.maxPrice);
        }

        if (parsedQuery.minPrice) {
            results = results.filter(p => p.price >= parsedQuery.minPrice);
        }

        // Keyword matching in name/description
        if (parsedQuery.keywords && parsedQuery.keywords.length > 0) {
            results = results.filter(p => {
                const searchText = `${p.name} ${p.description} ${p.features?.join(' ')}`.toLowerCase();
                return parsedQuery.keywords.some(keyword => searchText.includes(keyword));
            });
        }

        // Track search if user is logged in
        if (userId && parsedQuery.category) {
            await firestoreService.updateStats(userId, {
                totalSearches: 1,
                categoriesExplored: [parsedQuery.category]
            });
        }

        res.status(200).json({
            query,
            parsed: parsedQuery,
            results: results.slice(0, 20), // Limit to 20 results
            count: results.length
        });
    } catch (error) {
        console.error('Error processing search:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get conversation history
 */
export const getConversationHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const history = geminiService.getConversationHistory(userId);

        res.status(200).json({
            userId,
            history
        });
    } catch (error) {
        console.error('Error fetching conversation history:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Clear conversation history
 */
export const clearConversation = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        geminiService.clearConversation(userId);

        res.status(200).json({
            message: 'Conversation cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing conversation:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
