# AalayaX - AI Virtual Assistance & User Experience Engine

A hackathon prototype web application that provides personalized product recommendations using a local recommendation engine.

## Features

- **Firebase Authentication**: Google OAuth and Email/Password login
- **Preference-Based Recommendations**: Users select interests, budget, brand, and feature preferences
- **Local Recommendation Engine**: Runs entirely in frontend using a local dataset
- **Resilient Design**: Works even if Firebase or backend fails
- **Optional LLM Explanations**: Backend can generate explanations for recommendations
- **Modern UI**: Clean design with Tailwind CSS and gradient backgrounds

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Icons
- Firebase SDK (Auth + Firestore)

### Backend
- Node.js + Express
- Mock explanation endpoint (ready for LLM integration)

### Database
- Firebase Firestore (for user preferences and history)
- Local product dataset (26 items across 4 categories)

## Project Structure

```
AalayaX/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── PreferenceForm.jsx
│   │   │   ├── RecommendationList.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── data/
│   │   │   └── products.js
│   │   ├── utils/
│   │   │   └── recommendationEngine.js
│   │   ├── services/
│   │   │   ├── firebase.js
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── routes/
    │   └── explain.js
    ├── server.js
    ├── package.json
    └── .env
```

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google and Email/Password
4. Enable Firestore:
   - Go to Firestore Database
   - Create database in test mode (or production with rules)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and register a web app
   - Copy the Firebase configuration

### 2. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Firebase credentials
# Update frontend/src/services/firebase.js with your config

npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Backend Setup

```bash
cd backend
npm install

# .env file already exists with default values
# Optionally add LLM API keys when ready

npm run dev
```

The backend will run on `http://localhost:5000`

## How It Works

### Recommendation Algorithm

The system uses a weighted scoring algorithm:

```
priceScore = 1 - (abs(product.price - budget) / budget)
brandScore = match ? 1 : 0
featureScore = product.featureType === preference ? product.featureScore/10 : 0.3
ratingScore = product.rating / 5

finalScore = (priceScore × 0.4) + (featureScore × 0.3) + (brandScore × 0.2) + (ratingScore × 0.1)
```

Weights:
- Price match: 40%
- Feature preference: 30%
- Brand preference: 20%
- Product rating: 10%

### Data Flow

1. User logs in via Firebase Auth
2. User fills preference form
3. Preferences saved to Firestore (non-blocking)
4. Recommendation engine runs locally in browser
5. Top 3 results displayed instantly
6. Backend optionally generates LLM explanations

### Resilience

- **Firebase fails**: Login might fail, but if user reaches preferences, recommendations still work
- **Backend fails**: Recommendations still display; explanations show fallback text
- **No internet**: After initial auth, app can work with cached data

## Product Categories

The local dataset includes 26 products across 4 categories:

- **Shoes** (7 items): Nike, Adidas, Puma, New Balance, etc.
- **Tech** (8 items): AirPods, Sony headphones, Logitech devices, etc.
- **Music** (5 items): Fender guitar, Yamaha piano, Roland drums, etc.
- **Hobby** (6 items): DJI drone, GoPro, Wacom tablet, LEGO, etc.

## Future Enhancements

- [ ] Integrate real LLM (OpenAI, Anthropic) for explanations
- [ ] Add more products to dataset
- [ ] Implement user rating and feedback system
- [ ] Add product comparison feature
- [ ] Save favorite products
- [ ] Export recommendations as PDF
- [ ] Add more filtering options
- [ ] Implement collaborative filtering

## Development Notes

- This is a hackathon prototype - code is intentionally simple
- No payment system implemented
- No external product APIs used
- Dataset is entirely local
- LLM integration is optional and non-blocking

## License

MIT License - Feel free to use for hackathons and learning purposes.
