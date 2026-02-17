import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
    user: {
        type: String, // Storing firebase UID or similar
        required: true,
        unique: true // One preference document per user? Or multiple? The prompt says "include users {uid}". implies a structure.
        // The prompt says: "users {uid} ... generate unique uuid".
        // If we receive UID from login session, we use that.
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    preferences: {
        type: [mongoose.Schema.Types.Mixed], // Array of preference objects
        default: []
    },
    lastRecommendation: {
        type: Array, // "lastRecommendation"
        default: []
    }
}, {
    timestamps: true // createdAt, updatedAt
});

export default mongoose.model('UserPreference', userPreferenceSchema);
