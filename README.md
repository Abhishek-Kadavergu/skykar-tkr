# AalayaX - AI Virtual Assistance & User Experience Engine

**Complete AI-Powered Shopping Assistant** with conversational AI, voice search, and intelligent product recommendations.

## ✨ Features

### 🤖 AI Virtual Assistant (NEW!)
- **Conversational AI**: Chat with Gemini 2.0 Flash for personalized recommendations
- **Voice Search**: Speak naturally to search for products
- **Natural Language Processing**: "Find Nike shoes under 5000" → instant results
- **Context-Aware Responses**: AI remembers your preferences and conversation history
- **Multi-turn Conversations**: Deep, meaningful interactions with AI

### 🎯 Smart Recommendations
- **Preference-Based Engine**: Budget, brands, features, ratings
- **Multiple Categories**: Tech, Shoes, Fashion, Home
- **Real-time Scoring**: Intelligent product matching algorithm
- **AI Explanations**: Gemini AI explains why products match your needs

### 👤 User Features
- **Firebase Authentication**: Google OAuth & Email/Password
- **Favorites System**: Save products you love
- **Activity Tracking**: View history, searches, and stats
- **Real-time Stats**: Dashboard with personalized analytics
- **Profile Management**: Update preferences anytime

### 🎨 Modern UI/UX
- **Navigation Tour**: Interactive onboarding guide for new users
- **Floating Chat Bot**: AI accessible from any page
- **Responsive Design**: Works on all devices
- **Clean Interface**: Tailwind CSS with smooth animations
- **Voice Input**: Microphone button for hands-free interaction
- **Tour Restart**: Help button to replay the guided tour anytime

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Icons
- Firebase SDK (Auth + Firestore)
- Web Speech API for voice input

### Backend
- Node.js + Express
- Firebase Admin SDK
- Gemini 2.0 Flash API (Google AI)
- RESTful API architecture

### Database
- Firebase Firestore
  - User profiles & preferences
  - Recommendation history
  - Favorites & activity tracking
  - Real-time synchronization

## Project Structure

```
AalayaX/
├── backend/
│   ├── config/
│   │   └── firebase.js               # Firebase Admin setup
│   ├── controllers/
│   │   ├── aiController.js           # AI chat & search
│   │   ├── recommendationController.js
│   │   ├── userController.js         # Favorites, stats, tracking
│   │   └── userPreferenceController.js
│   ├── services/
│   │   ├── firestoreService.js       # Database operations
│   │   └── geminiService.js          # Gemini AI integration
│   ├── routes/
│   │   ├── aiRoutes.js               # AI endpoints
│   │   ├── userRoutes.js             # User endpoints
│   │   ├── recommendationRoutes.js
│   │   └── explain.js                # AI explanations
│   ├── server.js
│   ├── .env
│   └── serviceAccountKey.json        # Firebase credentials (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBot.jsx           # AI chat interface
│   │   │   ├── FloatingChatButton.jsx
│   │   │   ├── NavigationTour.jsx    # Interactive guided tour
│   │   │   ├── TourTrigger.jsx       # Tour restart button
│   │   │   ├── Navbar.jsx
│   │   │   ├── PreferenceForm.jsx
│   │   │   └── RecommendationList.jsx
│   │   ├── pages/
│   │   │   ├── AIAssistantPage.jsx   # AI features page
│   │   │   ├── HomePage.jsx          # Real-time stats
│   │   │   ├── RecommendationsPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/
│   │   │   ├── api.js                # Complete API integration
│   │   │   └── firebase.js
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
├── FIREBASE_SETUP.md                 # Complete setup guide
└── README.md
```
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
