import mongoose from 'mongoose';

const userRecommendationSchema = new mongoose.Schema({
    user: {
        type: String, // Storing firebase UID
        required: true,
        // One recommendation set per user? Or history? Unique per user allows easy replacement.
        unique: true
    },
    recommendations: [{
        product: {
            type: Object, // Storing full product details for simplicity in display
            required: true
        },
        matchScore: {
            type: Number,
            required: true
        },
        matchReasons: {
            type: [String],
            default: []
        }
    }],
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('UserRecommendation', userRecommendationSchema);
