import axios from 'axios';

/**
 * Google Places API Integration
 * Free tier: 28,000 requests/month
 * Documentation: https://developers.google.com/maps/documentation/places/web-service/overview
 */

class GooglePlacesAPI {
    constructor() {
        this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
        this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
        
        // Log initialization status
        if (this.apiKey) {
            console.log('✅ Google Places API initialized with key:', this.apiKey.substring(0, 10) + '...');
        } else {
            console.warn('⚠️  Google Places API key not configured - using fallback data');
        }
    }

    /**
     * Search nearby places based on user preferences
     */
    async searchNearby({ location, radius = 5000, type = 'restaurant', keyword = '', maxResults = 20 }) {
        try {
            if (!this.apiKey) {
                console.warn('Google Places API key not configured');
                return [];
            }

            const params = {
                location: `${location.lat},${location.lng}`,
                radius,
                type,
                keyword,
                key: this.apiKey
            };

            const response = await axios.get(`${this.baseUrl}/nearbysearch/json`, { params });

            if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
                console.error('Google Places API error:', response.data.status);
                console.error('Error message:', response.data.error_message || 'No error message');
                console.error('Full response:', JSON.stringify(response.data, null, 2));
                return [];
            }

            return this.formatResults(response.data.results.slice(0, maxResults));
        } catch (error) {
            console.error('Error fetching from Google Places:', error.message);
            return [];
        }
    }

    /**
     * Text search for places
     */
    async textSearch({ query, location, radius = 10000, type = '', maxResults = 20 }) {
        try {
            if (!this.apiKey) {
                console.warn('Google Places API key not configured');
                return [];
            }

            const params = {
                query,
                key: this.apiKey
            };

            if (location) {
                params.location = `${location.lat},${location.lng}`;
                params.radius = radius;
            }

            if (type) {
                params.type = type;
            }

            const response = await axios.get(`${this.baseUrl}/textsearch/json`, { params });

            if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
                console.error('Google Places API error:', response.data.status);
                console.error('Error message:', response.data.error_message || 'No error message');
                console.error('Full response:', JSON.stringify(response.data, null, 2));
                return [];
            }

            return this.formatResults(response.data.results.slice(0, maxResults));
        } catch (error) {
            console.error('Error in text search:', error.message);
            return [];
        }
    }

    /**
     * Get place details
     */
    async getPlaceDetails(placeId) {
        try {
            if (!this.apiKey) {
                return null;
            }

            const params = {
                place_id: placeId,
                fields: 'name,rating,formatted_address,formatted_phone_number,opening_hours,website,photos,reviews,price_level,types',
                key: this.apiKey
            };

            const response = await axios.get(`${this.baseUrl}/details/json`, { params });

            if (response.data.status !== 'OK') {
                console.error('Place details error:', response.data.status);
                return null;
            }

            return this.formatPlaceDetails(response.data.result);
        } catch (error) {
            console.error('Error fetching place details:', error.message);
            return null;
        }
    }

    /**
     * Format results to unified structure
     */
    formatResults(places) {
        return places.map(place => ({
            id: place.place_id,
            name: place.name,
            category: 'Restaurant',
            rating: place.rating || 0,
            totalRatings: place.user_ratings_total || 0,
            priceLevel: place.price_level || 0,
            address: place.vicinity || place.formatted_address || '',
            location: place.geometry?.location || {},
            isOpen: place.opening_hours?.open_now || null,
            types: place.types || [],
            photos: place.photos ? place.photos.map(photo => 
                `${this.baseUrl}/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${this.apiKey}`
            ) : [],
            image: place.photos?.[0] ? 
                `${this.baseUrl}/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${this.apiKey}` 
                : 'https://placehold.co/400x300/png?text=No+Image',
            source: 'google_places',
            placeId: place.place_id
        }));
    }

    /**
     * Format detailed place information
     */
    formatPlaceDetails(place) {
        return {
            id: place.place_id,
            name: place.name,
            rating: place.rating || 0,
            address: place.formatted_address || '',
            phone: place.formatted_phone_number || '',
            website: place.website || '',
            openingHours: place.opening_hours?.weekday_text || [],
            isOpen: place.opening_hours?.open_now || null,
            priceLevel: place.price_level || 0,
            types: place.types || [],
            photos: place.photos ? place.photos.map(photo => 
                `${this.baseUrl}/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${this.apiKey}`
            ) : [],
            reviews: (place.reviews || []).map(review => ({
                author: review.author_name,
                rating: review.rating,
                text: review.text,
                time: review.time
            })),
            source: 'google_places'
        };
    }

    /**
     * Search restaurants with filters
     */
    async searchRestaurants({ location, cuisine = '', maxPrice = null, minRating = 0, maxResults = 20 }) {
        let query = cuisine ? `${cuisine} restaurant` : 'restaurant';
        
        const results = await this.textSearch({
            query,
            location,
            type: 'restaurant',
            maxResults: maxResults * 2 // Get more to filter
        });

        // Apply filters
        let filtered = results.filter(place => {
            if (minRating && place.rating < minRating) return false;
            if (maxPrice !== null && place.priceLevel > maxPrice) return false;
            return true;
        });

        return filtered.slice(0, maxResults);
    }
}

export default new GooglePlacesAPI();
