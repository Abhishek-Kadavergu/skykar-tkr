import googlePlacesAPI from '../integrations/googlePlacesAPI.js';
import tmdbAPI from '../integrations/tmdbAPI.js';
import dummyJsonAPI from '../integrations/dummyJsonAPI.js';
import products from '../data/products.js';

/**
 * Data Source Manager
 * Routes requests to appropriate APIs based on category
 * Handles caching, fallbacks, and data normalization
 */

class DataSourceManager {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 3600000; // 1 hour
        
        // Category to API mapping
        this.categoryMapping = {
            'restaurant': 'google_places',
            'food': 'google_places',
            'dining': 'google_places',
            'cafe': 'google_places',
            'movie': 'tmdb',
            'tv': 'tmdb',
            'show': 'tmdb',
            'film': 'tmdb',
            // DummyJSON API (100 real products with images)
            'tech': 'dummyjson',
            'laptop': 'dummyjson',
            'laptops': 'dummyjson',
            'phone': 'dummyjson',
            'smartphone': 'dummyjson',
            'smartphones': 'dummyjson',
            'watch': 'dummyjson',
            'watches': 'dummyjson',
            'perfume': 'dummyjson',
            'fragrance': 'dummyjson',
            'beauty': 'dummyjson',
            'skincare': 'dummyjson',
            'furniture': 'dummyjson',
            'home': 'dummyjson',
            'grocery': 'dummyjson',
            'automotive': 'dummyjson',
            // Keep local for music (not in DummyJSON)
            'music': 'local',
            'song': 'local',
            'album': 'local',
            'artist': 'local',
            'track': 'local',
            'shoes': 'local'
        };
    }

    /**
     * Get recommendations based on user preferences
     */
    async getRecommendations({ userId, preferences, location = null }) {
        try {
            console.log('🌍 DataSourceManager received location:', location ? `${location.lat}, ${location.lng}` : 'No location');
            const allRecommendations = [];

            for (const preference of preferences) {
                const { category, budget, brands, featurePreference } = preference;
                
                // Determine data source
                const source = this.determineSource(category);
                console.log(`📡 Fetching category "${category}" (normalized: "${category.toLowerCase()}") from source: ${source}`);

                let recommendations = [];

                switch (source) {
                    case 'google_places':
                        recommendations = await this.getRestaurantRecommendations({
                            preference,
                            location
                        });
                        break;

                    case 'tmdb':
                        recommendations = await this.getMovieRecommendations({
                            preference
                        });
                        break;

                    case 'dummyjson':
                        recommendations = await this.getDummyJsonRecommendations({
                            preference
                        });
                        break;

                    case 'local':
                    default:
                        recommendations = await this.getLocalRecommendations({
                            preference
                        });
                        break;
                }

                // Add scoring and metadata
                recommendations = recommendations.map((item, index) => ({
                    ...item,
                    matchScore: this.calculateMatchScore(item, preference),
                    matchReasons: this.generateMatchReasons(item, preference),
                    preferenceCategory: category,
                    rank: index + 1
                }));

                allRecommendations.push(...recommendations);
            }

            return allRecommendations;
        } catch (error) {
            console.error('Error in getRecommendations:', error);
            throw error;
        }
    }

    /**
     * Get restaurant recommendations from Google Places
     */
    async getRestaurantRecommendations({ preference, location }) {
        try {
            if (!location) {
                console.error('❌ No location provided for restaurant search - Google Places API requires location');
                console.log('💡 Please enable location permission in your browser to see real restaurants');
                return [];
            }

            const { category, budget, featurePreference } = preference;
            
            console.log('🔍 Searching restaurants with:', { location, cuisine: featurePreference, budget });
            
            const results = await googlePlacesAPI.searchRestaurants({
                location,
                cuisine: featurePreference || category,
                maxPrice: this.budgetToPriceLevel(budget),
                minRating: 3.5,
                maxResults: 10
            });

            console.log(`✅ Google Places returned ${results.length} restaurants`);

            if (results.length === 0) {
                console.warn('⚠️  Google Places returned no results - try adjusting your search criteria');
                return [];
            }

            return results.map(place => ({
                ...place,
                price: this.estimatePrice(place.priceLevel),
                featureType: featurePreference || 'General',
                featureScore: place.rating * 2,
                breakdown: {
                    priceScore: this.scorePriceMatch(place.priceLevel, budget),
                    featureScore: Math.round(place.rating * 20),
                    brandScore: 75 // Neutral for restaurants
                }
            }));
        } catch (error) {
            console.error('❌ Error fetching restaurant recommendations:', error);
            return [];
        }
    }

    /**
     * Get movie/TV recommendations from TMDB
     */
    async getMovieRecommendations({ preference }) {
        try {
            const { featurePreference, budget } = preference;
            
            let results = [];

            if (featurePreference) {
                // Search by genre
                results = await tmdbAPI.searchByGenre({
                    genre: featurePreference,
                    mediaType: 'movie',
                    maxResults: 10
                });
            } else {
                // Get trending
                results = await tmdbAPI.getTrending({
                    mediaType: 'movie',
                    timeWindow: 'week'
                });
                results = results.slice(0, 10);
            }

            return results.map(movie => ({
                ...movie,
                price: 0, // Free to browse
                brand: 'TMDB',
                featureType: featurePreference || 'General',
                featureScore: movie.rating,
                breakdown: {
                    priceScore: 100, // Movies are free to view info
                    featureScore: Math.round(movie.rating * 10),
                    brandScore: Math.round(movie.popularity / 10)
                }
            }));
        } catch (error) {
            console.error('Error fetching movie recommendations:', error);
            return [];
        }
    }

    /**
     * Get product recommendations from DummyJSON API
     * FREE API with 100 real products and images - perfect for hackathons!
     */
    async getDummyJsonRecommendations({ preference }) {
        try {
            const { category, budget, brands, featurePreference } = preference;
            
            console.log(`🛍️ Fetching DummyJSON products for category: ${category}`);
            
            // Fetch products by category from DummyJSON API
            let apiProducts = await dummyJsonAPI.getProductsByCategory(category, { limit: 30 });
            
            // Filter by budget if specified
            if (budget) {
                apiProducts = dummyJsonAPI.filterByBudget(apiProducts, budget);
            }
            
            // Filter by brands if specified
            let brandFiltered = apiProducts;
            if (brands && brands.length > 0) {
                brandFiltered = dummyJsonAPI.filterByBrand(apiProducts, brands);
            }
            
            // If brand filtering left 0 results, use all products from API (ignore brand filter)
            if (brandFiltered.length === 0 && apiProducts.length > 0) {
                brandFiltered = apiProducts;
            }

            // If DummyJSON returned 0 products (brand not in API), fall back to local product DB
            if (brandFiltered.length === 0) {
                console.log(`⚠️ DummyJSON returned 0 results for "${category}", falling back to local products`);
                return this.getLocalRecommendations({ preference });
            }
            
            // Sort by rating
            brandFiltered.sort((a, b) => b.rating - a.rating);
            
            // Limit to top 10
            const finalProducts = brandFiltered.slice(0, 10);
            
            console.log(`✅ Retrieved ${finalProducts.length} products from DummyJSON with images`);
            
            return finalProducts.map(product => ({
                ...product,
                featureType: featurePreference || product.featureType,
                breakdown: {
                    priceScore: budget ? Math.max(0, Math.round((1 - (product.price / budget)) * 100)) : 80,
                    featureScore: Math.round(product.featureScore * 10),
                    brandScore: brands?.some(b => product.brand?.toLowerCase().includes(b.toLowerCase())) ? 100 : 70
                }
            }));
        } catch (error) {
            console.error('Error fetching DummyJSON recommendations:', error);
            // Fall back to local on any error
            return this.getLocalRecommendations({ preference });
        }
    }

    /**
     * Get recommendations from local product database
     */
    async getLocalRecommendations({ preference }) {
        const { budget, brands = [], featurePreference, category } = preference;

        // Filter products by category
        let candidateProducts = products.filter(
            product => product.category && product.category.toLowerCase() === category.toLowerCase()
        );

        if (candidateProducts.length === 0) {
            return [];
        }

        // Score products
        const scoredProducts = candidateProducts.map(product => {
            let score = 100; // Base score
            let priceScore = 0, brandScore = 0, featureScore = 0;

            // Brand matching
            if (brands && brands.length > 0) {
                const brandMatch = brands.some(b => b.toLowerCase() === product.brand.toLowerCase());
                if (brandMatch) {
                    score += 50;
                    brandScore = 100;
                } else {
                    brandScore = 40;
                }
            } else {
                brandScore = 70;
            }

            // Feature matching
            if (featurePreference && product.featureType && 
                product.featureType.toLowerCase() === featurePreference.toLowerCase()) {
                score += 30;
                featureScore = 100;
            } else if (featurePreference) {
                featureScore = 50;
            } else {
                featureScore = 75;
            }

            // Budget matching
            if (budget) {
                if (product.price <= budget) {
                    score += 40;
                    priceScore = 100;
                } else if (product.price <= budget * 1.1) {
                    score += 20;
                    priceScore = 80;
                } else if (product.price <= budget * 1.3) {
                    priceScore = 50;
                } else {
                    priceScore = 20;
                }
            } else {
                priceScore = 85;
            }

            // Rating boost
            if (product.rating) {
                score += product.rating * 2;
            }

            return {
                ...product,
                matchScore: score,
                breakdown: {
                    priceScore: Math.round(priceScore),
                    featureScore: Math.round(featureScore),
                    brandScore: Math.round(brandScore)
                }
            };
        });

        // Sort and return top results
        return scoredProducts
            .filter(item => item.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);
    }

    /**
     * Search across all data sources
     */
    async search({ query, category = null, location = null, limit = 20 }) {
        try {
            const results = [];

            // Determine which APIs to search
            const categoriesToSearch = category ? [category] : ['restaurant', 'movie'];

            for (const cat of categoriesToSearch) {
                const source = this.determineSource(cat);

                switch (source) {
                    case 'google_places':
                        if (location) {
                            const places = await googlePlacesAPI.textSearch({
                                query,
                                location,
                                type: 'restaurant',
                                maxResults: Math.ceil(limit / categoriesToSearch.length)
                            });
                            results.push(...places);
                        }
                        break;

                    case 'tmdb':
                        const movies = await tmdbAPI.search({
                            query,
                            type: 'multi',
                            page: 1
                        });
                        results.push(...movies.slice(0, Math.ceil(limit / categoriesToSearch.length)));
                        break;
                }
            }

            return results.slice(0, limit);
        } catch (error) {
            console.error('Error in multi-source search:', error);
            return [];
        }
    }

    /**
     * Helper: Determine data source for category
     */
    determineSource(category) {
        const normalized = category.toLowerCase().trim();
        return this.categoryMapping[normalized] || 'local';
    }

    /**
     * Helper: Convert budget to Google Places price level (0-4)
     */
    budgetToPriceLevel(budget) {
        if (!budget) return 4;
        if (budget < 500) return 1;
        if (budget < 1500) return 2;
        if (budget < 3000) return 3;
        return 4;
    }

    /**
     * Helper: Estimate price from price level
     */
    estimatePrice(priceLevel) {
        const priceMap = { 0: 200, 1: 400, 2: 1000, 3: 2000, 4: 4000 };
        return priceMap[priceLevel] || 1000;
    }

    /**
     * Helper: Score price match
     */
    scorePriceMatch(priceLevel, budget) {
        if (!budget) return 85;
        const estimatedPrice = this.estimatePrice(priceLevel);
        if (estimatedPrice <= budget) return 100;
        if (estimatedPrice <= budget * 1.2) return 70;
        if (estimatedPrice <= budget * 1.5) return 40;
        return 20;
    }

    /**
     * Calculate match score for any item
     */
    calculateMatchScore(item, preference) {
        if (item.matchScore) return item.matchScore;
        
        let score = 100;
        
        // Rating component
        if (item.rating) {
            score += item.rating * 10;
        }

        // Price component
        if (preference.budget && item.price) {
            if (item.price <= preference.budget) {
                score += 40;
            }
        }

        return Math.round(score);
    }

    /**
     * Generate match reasons
     */
    generateMatchReasons(item, preference) {
        const reasons = [];

        if (item.matchReasons) return item.matchReasons;

        if (item.category === preference.category) {
            reasons.push(`Matches your interest in ${item.category}`);
        }

        if (item.rating && item.rating >= 4) {
            reasons.push(`Highly rated (${item.rating}★)`);
        }

        if (preference.budget && item.price && item.price <= preference.budget) {
            reasons.push('Within your budget');
        }

        if (item.source === 'google_places' && item.location) {
            reasons.push('Near your location');
        }

        return reasons;
    }
}

export default new DataSourceManager();
