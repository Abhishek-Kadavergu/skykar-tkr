import axios from 'axios';

/**
 * TMDB (The Movie Database) API Integration
 * FREE - Unlimited requests for non-commercial use
 * Documentation: https://developers.themoviedb.org/3
 */

class TMDBAPI {
    constructor() {
        this.apiKey = process.env.TMDB_API_KEY || '';
        this.baseUrl = 'https://api.themoviedb.org/3';
        this.imageBaseUrl = 'https://image.tmdb.org/t/p';
        
        // Log initialization status
        if (this.apiKey) {
            console.log('✅ TMDB API initialized with key:', this.apiKey.substring(0, 10) + '...');
        } else {
            console.warn('⚠️  TMDB API key not configured');
        }
    }

    /**
     * Search movies and TV shows
     */
    async search({ query, type = 'multi', page = 1 }) {
        try {
            if (!this.apiKey) {
                console.warn('TMDB API key not configured');
                return [];
            }

            const response = await axios.get(`${this.baseUrl}/search/${type}`, {
                params: {
                    api_key: this.apiKey,
                    query,
                    page,
                    include_adult: false
                }
            });

            return this.formatSearchResults(response.data.results);
        } catch (error) {
            console.error('Error searching TMDB:', error.message);
            return [];
        }
    }

    /**
     * Get trending movies/TV shows
     */
    async getTrending({ mediaType = 'all', timeWindow = 'week', page = 1 }) {
        try {
            if (!this.apiKey) return [];

            const response = await axios.get(`${this.baseUrl}/trending/${mediaType}/${timeWindow}`, {
                params: {
                    api_key: this.apiKey,
                    page
                }
            });

            return this.formatSearchResults(response.data.results);
        } catch (error) {
            console.error('Error fetching trending:', error.message);
            return [];
        }
    }

    /**
     * Get popular movies/TV shows
     */
    async getPopular({ mediaType = 'movie', page = 1 }) {
        try {
            if (!this.apiKey) return [];

            const response = await axios.get(`${this.baseUrl}/${mediaType}/popular`, {
                params: {
                    api_key: this.apiKey,
                    page
                }
            });

            return this.formatSearchResults(response.data.results, mediaType);
        } catch (error) {
            console.error('Error fetching popular:', error.message);
            return [];
        }
    }

    /**
     * Get movie/TV show details
     */
    async getDetails({ id, mediaType = 'movie' }) {
        try {
            if (!this.apiKey) return null;

            const response = await axios.get(`${this.baseUrl}/${mediaType}/${id}`, {
                params: {
                    api_key: this.apiKey,
                    append_to_response: 'videos,credits,similar,watch/providers'
                }
            });

            return this.formatDetails(response.data, mediaType);
        } catch (error) {
            console.error('Error fetching details:', error.message);
            return null;
        }
    }

    /**
     * Discover movies/TV with filters
     */
    async discover({ 
        mediaType = 'movie', 
        genre = null, 
        year = null, 
        minRating = 0,
        sortBy = 'popularity.desc',
        page = 1 
    }) {
        try {
            if (!this.apiKey) return [];

            const params = {
                api_key: this.apiKey,
                page,
                sort_by: sortBy,
                'vote_average.gte': minRating,
                include_adult: false
            };

            if (genre) params.with_genres = genre;
            if (year) {
                if (mediaType === 'movie') {
                    params.primary_release_year = year;
                } else {
                    params.first_air_date_year = year;
                }
            }

            const response = await axios.get(`${this.baseUrl}/discover/${mediaType}`, { params });

            return this.formatSearchResults(response.data.results, mediaType);
        } catch (error) {
            console.error('Error in discover:', error.message);
            return [];
        }
    }

    /**
     * Get recommendations based on a movie/TV show
     */
    async getRecommendations({ id, mediaType = 'movie', page = 1 }) {
        try {
            if (!this.apiKey) return [];

            const response = await axios.get(`${this.baseUrl}/${mediaType}/${id}/recommendations`, {
                params: {
                    api_key: this.apiKey,
                    page
                }
            });

            return this.formatSearchResults(response.data.results, mediaType);
        } catch (error) {
            console.error('Error fetching recommendations:', error.message);
            return [];
        }
    }

    /**
     * Search by genre preference
     */
    async searchByGenre({ genre, mediaType = 'movie', maxResults = 20 }) {
        try {
            // Get genre ID
            const genres = await this.getGenres(mediaType);
            const genreObj = genres.find(g => g.name.toLowerCase() === genre.toLowerCase());
            
            if (!genreObj) {
                return this.getPopular({ mediaType });
            }

            const results = await this.discover({
                mediaType,
                genre: genreObj.id,
                sortBy: 'vote_average.desc'
            });

            return results.slice(0, maxResults);
        } catch (error) {
            console.error('Error searching by genre:', error.message);
            return [];
        }
    }

    /**
     * Get genre list
     */
    async getGenres(mediaType = 'movie') {
        try {
            if (!this.apiKey) return [];

            const response = await axios.get(`${this.baseUrl}/genre/${mediaType}/list`, {
                params: { api_key: this.apiKey }
            });

            return response.data.genres;
        } catch (error) {
            console.error('Error fetching genres:', error.message);
            return [];
        }
    }

    /**
     * Format search results to unified structure
     */
    formatSearchResults(results, mediaType = null) {
        return results.map(item => {
            const type = mediaType || item.media_type || 'movie';
            const isMovie = type === 'movie';

            return {
                id: item.id,
                tmdbId: item.id,
                name: isMovie ? item.title : item.name,
                category: isMovie ? 'Movie' : 'TV Show',
                mediaType: type,
                rating: item.vote_average || 0,
                totalRatings: item.vote_count || 0,
                releaseDate: isMovie ? item.release_date : item.first_air_date,
                year: (isMovie ? item.release_date : item.first_air_date)?.split('-')[0] || 'N/A',
                overview: item.overview || '',
                image: item.poster_path ? `${this.imageBaseUrl}/w500${item.poster_path}` : 'https://placehold.co/500x750/png?text=No+Poster',
                backdrop: item.backdrop_path ? `${this.imageBaseUrl}/original${item.backdrop_path}` : null,
                popularity: item.popularity || 0,
                language: item.original_language || 'en',
                source: 'tmdb'
            };
        });
    }

    /**
     * Format detailed information
     */
    formatDetails(data, mediaType = 'movie') {
        const isMovie = mediaType === 'movie';

        return {
            id: data.id,
            tmdbId: data.id,
            name: isMovie ? data.title : data.name,
            category: isMovie ? 'Movie' : 'TV Show',
            mediaType,
            rating: data.vote_average || 0,
            totalRatings: data.vote_count || 0,
            releaseDate: isMovie ? data.release_date : data.first_air_date,
            year: (isMovie ? data.release_date : data.first_air_date)?.split('-')[0] || 'N/A',
            runtime: isMovie ? data.runtime : data.episode_run_time?.[0],
            genres: data.genres?.map(g => g.name) || [],
            overview: data.overview || '',
            tagline: data.tagline || '',
            image: data.poster_path ? `${this.imageBaseUrl}/w500${data.poster_path}` : null,
            backdrop: data.backdrop_path ? `${this.imageBaseUrl}/original${data.backdrop_path}` : null,
            trailer: this.extractTrailer(data.videos?.results || []),
            cast: (data.credits?.cast || []).slice(0, 10).map(person => ({
                name: person.name,
                character: person.character,
                image: person.profile_path ? `${this.imageBaseUrl}/w185${person.profile_path}` : null
            })),
            similar: this.formatSearchResults((data.similar?.results || []).slice(0, 6), mediaType),
            streamingOn: this.formatProviders(data['watch/providers']?.results),
            homepage: data.homepage || '',
            status: data.status || '',
            source: 'tmdb'
        };
    }

    /**
     * Extract YouTube trailer
     */
    extractTrailer(videos) {
        const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    }

    /**
     * Format streaming providers
     */
    formatProviders(providers) {
        if (!providers) return [];

        const regions = ['US', 'IN', 'GB']; // Priority regions
        const availableProviders = [];

        regions.forEach(region => {
            if (providers[region]?.flatrate) {
                providers[region].flatrate.forEach(provider => {
                    if (!availableProviders.find(p => p.name === provider.provider_name)) {
                        availableProviders.push({
                            name: provider.provider_name,
                            logo: `${this.imageBaseUrl}/w92${provider.logo_path}`,
                            region
                        });
                    }
                });
            }
        });

        return availableProviders;
    }
}

export default new TMDBAPI();
