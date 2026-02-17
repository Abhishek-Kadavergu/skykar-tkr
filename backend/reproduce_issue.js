
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { createRecommendations } from './controllers/recommendationController.js';
import UserPreference from './models/userPreferenceModel.js';

dotenv.config();

const reproduceIssue = async () => {
    const logStream = fs.createWriteStream('reproduce_output.txt');
    const log = (msg) => {
        console.log(msg);
        logStream.write(msg + '\n');
    };

    try {
        await mongoose.connect(process.env.MONGO_URI);
        log('Connected to MongoDB');

        const testUserId = 'test-user-shoes';

        // 1. Setup Test User Preference with 'category' (Singular, potential frontend mismatch)
        // note: 'interests' is NOT set here.
        await UserPreference.findOneAndUpdate(
            { user: testUserId },
            {
                user: testUserId,
                name: 'Shoe Lover',
                email: 'shoes@example.com',
                preferences: [{
                    budget: 10000,
                    brandPreference: 'Nike',
                    category: 'Shoes', // <--- SUSPECTED ISSUE: Frontend might send this
                    // interests: ['Shoes'] // <--- This is what my code expects
                }]
            },
            { upsert: true, new: true }
        );
        log('Test user preference saved (with category="Shoes", NOT interests).');

        // 2. Generate Recommendations
        log('Generating recommendations...');
        const recommendations = await createRecommendations(testUserId);

        // 3. Assert
        log('\n--- REPRODUCTION RESULTS ---');
        let allShoes = true;
        let musicFound = false;

        recommendations.forEach((rec, index) => {
            log(`#${index + 1}: ${rec.product.name} (${rec.product.category}) - Score: ${rec.matchScore}`);
            if (rec.product.category !== 'Shoes') {
                allShoes = false;
                log(`ERROR: Found non-shoe category: ${rec.product.category}`);
            }
            if (rec.product.category === 'Music') {
                musicFound = true;
            }
        });

        if (allShoes) {
            log('PASSED: Only "Shoes" recommended.');
        } else {
            log('FAILED: "Shoes" preference resulted in mixed categories.');
            if (musicFound) {
                log('CONFIRMED ISSUE: Music was recommended despite "Shoes" preference.');
            }
        }

    } catch (error) {
        log(`Test Error: ${error.message}`);
    } finally {
        await mongoose.disconnect();
        logStream.end();
    }
};

reproduceIssue();
