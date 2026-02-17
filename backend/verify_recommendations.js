
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { createRecommendations } from './controllers/recommendationController.js';
import UserPreference from './models/userPreferenceModel.js';

dotenv.config();

const verifyFix = async () => {
    const logStream = fs.createWriteStream('verification_output.txt');
    const log = (msg) => {
        console.log(msg);
        logStream.write(msg + '\n');
    };

    try {
        await mongoose.connect(process.env.MONGO_URI);
        log('Connected to MongoDB');

        const testUserId = 'test-user-verification';

        // 1. Setup Test User Preference
        await UserPreference.findOneAndUpdate(
            { user: testUserId },
            {
                user: testUserId,
                name: 'Verification User',
                email: 'verify@example.com',
                preferences: [{
                    budget: 20000,
                    brandPreference: 'Titan',
                    featurePreference: 'Smart',
                    interests: ['Watches'] // Strict filter
                }]
            },
            { upsert: true, new: true }
        );
        log('Test user preference saved.');

        // 2. Generate Recommendations
        log('Generating recommendations...');
        const recommendations = await createRecommendations(testUserId);

        // 3. Assert
        log('\n--- VERIFICATION RESULTS ---');
        let allWatches = true;
        let titanFound = false;

        recommendations.forEach((rec, index) => {
            log(`#${index + 1}: ${rec.product.name} (${rec.product.category}) - Score: ${rec.matchScore}`);
            if (rec.product.category !== 'Watches') {
                allWatches = false;
                log(`ERROR: Found non-watch category: ${rec.product.category}`);
            }
            if (rec.product.brand === 'Titan') {
                titanFound = true;
            }
        });

        if (allWatches) {
            log('PASSED: All recommendations are strictly Matches.');
        } else {
            log('FAILED: Recommendations include non-watch categories.');
        }

        if (titanFound) {
            log('PASSED: Found Titan brand in recommendations.');
        } else {
            log('WARNING: Titan brand not found (might be budget or other factors).');
        }

    } catch (error) {
        log(`Test Error: ${error.message}`);
    } finally {
        await mongoose.disconnect();
        logStream.end();
    }
};

verifyFix();
