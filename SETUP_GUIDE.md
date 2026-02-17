# Quick Setup Guide for AalayaX

## Step 1: Install Dependencies

### Frontend:
```bash
cd frontend
npm install
```

### Backend:
```bash
cd backend
npm install
```

## Step 2: Configure Firebase

1. Visit https://console.firebase.google.com/
2. Create a new project named "AalayaX" (or any name)
3. Enable Authentication:
   - Click "Authentication" in left sidebar
   - Click "Get Started"
   - Enable "Google" sign-in method
   - Enable "Email/Password" sign-in method
4. Enable Firestore:
   - Click "Firestore Database" in left sidebar
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location
5. Get your config:
   - Click the gear icon next to "Project Overview"
   - Click "Project settings"
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Register app with nickname "aalayax-web"
   - Copy the firebaseConfig object

## Step 3: Update Firebase Configuration

### Option A: Update .env file (Recommended for Vite)
Edit `frontend/.env`:
```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then update `frontend/src/services/firebase.js` to use environment variables:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

### Option B: Direct replacement
Replace the firebaseConfig object in `frontend/src/services/firebase.js` with your copied config.

## Step 4: Run the Application

### Terminal 1 - Backend:
```bash
cd backend
npm start
```
Backend will run on http://localhost:5000

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

## Step 5: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Continue with Google" or create an account with email
3. Fill in your preferences:
   - Select categories (Shoes, Tech, Music, Hobby)
   - Set your budget with the slider
   - Choose a preferred brand (optional)
   - Select your most important feature
4. Click "Get Recommendations"
5. View your top 3 personalized recommendations!

## Troubleshooting

### Firebase Authentication Error
- Make sure you enabled Google and Email/Password in Firebase Console
- Check that your Firebase config is correct
- For Google sign-in, add your domain to authorized domains

### Backend Connection Error
- Make sure backend is running on port 5000
- Check VITE_API_URL in frontend/.env matches your backend URL
- Explanations will show fallback text if backend fails (this is by design)

### No Recommendations Shown
- Make sure you selected at least one category
- Check browser console for errors
- Verify products.js file exists in frontend/src/data/

### Port Already in Use
Frontend:
```bash
# Edit vite.config.js and change port number
server: {
  port: 3001  // or any available port
}
```

Backend:
```bash
# Edit backend/.env and change PORT
PORT=5001  # or any available port
```

## Firebase Security Rules (Optional)

For production, update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Notes

- The app works even if Firebase fails (after initial login)
- Recommendations run entirely in the browser
- Backend is optional - only provides LLM explanations
- Dataset is local and contains 26 products

Happy hacking!
