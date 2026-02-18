import axios from 'axios';

/**
 * DummyJSON Product API Integration
 * FREE API with 100 products across multiple categories
 * No API key required - perfect for hackathons!
 * URL: https://dummyjson.com
 */

const BASE_URL = 'https://dummyjson.com';

class DummyJsonAPI {
    constructor() {
        this.client = axios.create({
            baseURL: BASE_URL,
            timeout: 10000
        });
    }

    /**
     * Get all products (paginated)
     */
    async getAllProducts({ limit = 30, skip = 0 } = {}) {
        try {
            const response = await this.client.get('/products', {
                params: { limit, skip }
            });

            return this.normalizeProducts(response.data.products);
        } catch (error) {
            console.error('DummyJSON API error:', error.message);
            return [];
        }
    }

    /**
     * Get products by category
     */
    async getProductsByCategory(category, { limit = 20 } = {}) {
        try {
            // DummyJSON category names (lowercase, hyphenated)
            const categoryMap = {
                'tech': 'laptops',
                'laptop': 'laptops',
                'laptops': 'laptops',
                'phone': 'smartphones',
                'smartphone': 'smartphones',
                'smartphones': 'smartphones',
                'fragrance': 'fragrances',
                'perfume': 'fragrances',
                'fragrances': 'fragrances',
                'skincare': 'skincare',
                'beauty': 'skincare',
                'grocery': 'groceries',
                'groceries': 'groceries',
                'food': 'groceries',
                'decoration': 'home-decoration',
                'home': 'home-decoration',
                'furniture': 'furniture',
                'watch': 'mens-watches',
                'watches': 'mens-watches',
                'mens-watches': 'mens-watches',
                'womens-watches': 'womens-watches',
                'sunglasses': 'sunglasses',
                'accessories': 'sunglasses',
                'automotive': 'automotive',
                'motorcycle': 'motorcycle',
                'lighting': 'lighting'
            };

            const apiCategory = categoryMap[category.toLowerCase()] || 'smartphones';
            
            console.log(`📦 DummyJSON: Fetching category "${category}" → API category: "${apiCategory}"`);

            const response = await this.client.get(`/products/category/${apiCategory}`);
            
            return this.normalizeProducts(response.data.products.slice(0, limit));
        } catch (error) {
            console.error(`DummyJSON category error for "${category}":`, error.message);
            // Fallback to general products
            return this.getAllProducts({ limit });
        }
    }

    /**
     * Search products by query
     */
    async searchProducts(query, { limit = 20 } = {}) {
        try {
            const response = await this.client.get('/products/search', {
                params: { q: query, limit }
            });

            return this.normalizeProducts(response.data.products);
        } catch (error) {
            console.error('DummyJSON search error:', error.message);
            return [];
        }
    }

    /**
     * Get single product by ID
     */
    async getProductById(id) {
        try {
            const response = await this.client.get(`/products/${id}`);
            return this.normalizeProducts([response.data])[0];
        } catch (error) {
            console.error('DummyJSON product fetch error:', error.message);
            return null;
        }
    }

    /**
     * Get all available categories
     */
    async getCategories() {
        try {
            const response = await this.client.get('/products/categories');
            return response.data;
        } catch (error) {
            console.error('DummyJSON categories error:', error.message);
            return [];
        }
    }

    /**
     * Normalize product data to match our application format
     */
    normalizeProducts(products) {
        return products.map(product => ({
            id: `dummy_${product.id}`,
            name: product.title,
            category: this.normalizeCategory(product.category),
            brand: product.brand || 'Generic',
            price: Math.round(product.price * 80), // Convert USD to INR (approx)
            originalPrice: product.price, // USD price
            rating: product.rating || 4.0,
            image: product.thumbnail || product.images?.[0] || 'https://placehold.co/400x400/png?text=No+Image',
            images: product.images || [product.thumbnail], // Multiple images for 360 viewer!
            description: product.description || '',
            stock: product.stock || 0,
            inStock: product.stock > 0,
            discount: product.discountPercentage || 0,
            tags: product.tags || [],
            
            // Additional metadata
            featureType: this.getFeatureType(product.category),
            featureScore: Math.min(product.rating * 2, 10), // Convert 5-star to 10-point scale
            matchReasons: [],
            
            // Source tracking
            source: 'dummyjson',
            apiData: {
                sku: product.sku,
                weight: product.weight,
                dimensions: product.dimensions,
                warrantyInformation: product.warrantyInformation,
                shippingInformation: product.shippingInformation,
                returnPolicy: product.returnPolicy
            }
        }));
    }

    /**
     * Normalize category names to match our app
     */
    normalizeCategory(category) {
        const categoryMap = {
            'laptops': 'Tech',
            'smartphones': 'Tech',
            'fragrances': 'Perfume',
            'skincare': 'Beauty',
            'groceries': 'Food',
            'home-decoration': 'Home',
            'furniture': 'Furniture',
            'mens-watches': 'Watches',
            'womens-watches': 'Watches',
            'sunglasses': 'Accessories',
            'automotive': 'Auto',
            'motorcycle': 'Vehicles',
            'lighting': 'Home'
        };

        return categoryMap[category] || category;
    }

    /**
     * Determine feature type based on category
     */
    getFeatureType(category) {
        const featureMap = {
            'laptops': 'Performance',
            'smartphones': 'Camera',
            'fragrances': 'Longevity',
            'skincare': 'Quality',
            'groceries': 'Freshness',
            'home-decoration': 'Style',
            'furniture': 'Durability',
            'mens-watches': 'Luxury',
            'womens-watches': 'Elegance',
            'sunglasses': 'UV Protection',
            'automotive': 'Reliability',
            'motorcycle': 'Speed',
            'lighting': 'Brightness'
        };

        return featureMap[category] || 'Quality';
    }

    /**
     * Filter products by budget
     */
    filterByBudget(products, budget) {
        if (!budget) return products;
        return products.filter(p => p.price <= budget);
    }

    /**
     * Filter products by brand
     */
    filterByBrand(products, brands) {
        if (!brands || brands.length === 0) return products;
        return products.filter(p => 
            brands.some(brand => 
                p.brand.toLowerCase().includes(brand.toLowerCase())
            )
        );
    }
}

export default new DummyJsonAPI();
