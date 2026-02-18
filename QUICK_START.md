# ⚡ QUICK START - Get Running in 5 Minutes!

## 🚀 Option 1: Demo Without API Keys (Fastest)

Your system works immediately with existing Gemini AI + local product database!

```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm run dev
```

**Open browser:** http://localhost:3000

**Test immediately:**
1. Login/Signup
2. Set preferences: Category "Shoes", Budget 10000
3. Get recommendations → See mock products with AI explanations!

---

## 🌟 Option 2: Full Experience with APIs (10 Minutes)

### Step 1: Get TMDB Key (2 minutes - EASIEST)
1. Go to https://www.themoviedb.org/signup
2. Verify email
3. Go to Settings → API → Request API Key (Developer)
4. Copy API Key

### Step 2: Add to Backend .env
```env
TMDB_API_KEY=your_tmdb_api_key_here
```

### Step 3: Restart Backend
```bash
cd backend
npm start
```

### Step 4: Test Movies!
1. Add preference: Category "Movie", Feature "Action"
2. Generate recommendations
3. See REAL movies with ratings, cast, trailers! 🎬

---

## 🏆 Option 3: Complete Experience (15 Minutes)

Get both APIs for full demo power!

### Quick Links:
- **TMDB:** https://www.themoviedb.org/settings/api (2 min)
- **Google Places:** https://console.cloud.google.com/ (5 min)

**Note:** Music, Shoes, Tech, Watches, Perfumes, TV all use local database (66 curated products)!

See `API_KEYS_GUIDE.md` for detailed instructions.

---

## 🎯 Features to Demo

### Without External APIs:
✅ AI-powered chat (Gemini)
✅ Voice search
✅ Local product recommendations (Music Albums, Shoes, Tech, Watches, Perfumes, TV)
✅ User preferences
✅ History tracking
✅ Favorites system
✅ Navigation tour

### With TMDB API:
✅ All above PLUS real movies/TV shows
✅ Trailers & cast info
✅ Streaming availability

### With Google Places API:
✅ All above PLUS real restaurants
✅ Location-based search
✅ Nearby recommendations
✅ Ratings & reviews

---

## 📱 Quick Test Scenarios

### Scenario 1: Shopping (No API needed)
```
Preferences:
- Category: Shoes
- Budget: 8000
- Brands: Nike, Adidas
- Feature: Running

Result: Top running shoes under budget!
```

### Scenario 2: Movies (Need TMDB API)
```
Preferences:
- Category: Movie
- Feature: Sci-Fi

Result: Real sci-fi movies with ratings!
```

### Scenario 3: Dining (Need Google Places API)
```
Preferences:
- Category: Restaurant
- Budget: 1000
- Feature: Italian
- Location: Auto-detected

Result: Real Italian restaurants nearby!
```

### Scenario 4: Music Albums (No API needed)
```
Preferences:
- Category: Music
- Feature: Focus

Result: Curated music albums (Lo-Fi Beats, Classical, etc.)!
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check port 5000 is free
netstat -ano | findstr :5000

# Kill process if needed
taskkill /F /PID <process_id>
```

### API not working
- Check .env file has correct keys (no quotes, no spaces)
- Restart backend after adding keys
- Check console for initialization messages

### Location not detected
- Allow location permission in browser
- Works best on HTTPS (localhost is fine)
- Can manually set location if needed

---

## 📊 What Judges Will See

### Immediate Impact (No Setup):
- ✅ Clean, professional UI
- ✅ Working AI chat
- ✅ Voice search
- ✅ Product recommendations
- ✅ Interactive tour

### With TMDB (2 min setup):
- ✅ All above PLUS
- ✅ Real movie database
- ✅ Trailers
- ✅ "Wow factor" ⬆️⬆️

### With All APIs (10 min setup):
- ✅ All above PLUS
- ✅ Location-based dining
- ✅ 8 total categories covered
- ✅ "Judge favorite" 🏆

---

## 💡 Pro Tips for Demo

1. **Start with local products** (shoes/tech) - works instantly
2. **Then show movies** (if you have TMDB key) - big wow
3. **Save restaurants for finale** (if you have Places key) - use YOUR location
4. **Use voice search** - judges love interactivity
5. **Show AI explanations** - highlight the "why" not just "what"

---

## 🎬 30-Second Elevator Pitch

> "AalayaX is an AI-powered recommendation platform that finds the perfect products, restaurants, movies, and music based on your preferences and location. Unlike other solutions, we integrate with real-world data sources like Google Places and TMDB, PLUS a curated collection of 66 products across 6 categories (Music Albums, Shoes, Tech, Watches, Perfumes, TV). Our Gemini 2.0 AI explains WHY each recommendation matches your needs. With features like 360° product views, voice search, and location-based suggestions, we deliver a truly personalized discovery experience."

---

## ✅ Pre-Demo Checklist

- [ ] Backend running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] Test user account created
- [ ] At least 2 preferences set
- [ ] Recommendations generated once
- [ ] AI chat tested
- [ ] Voice search works (microphone permission)
- [ ] Location permission granted (if using restaurants)

---

## 🚀 GO TIME!

Your system is **ready to impress**. Good luck! 🏆

**Remember:** Even without external APIs, you have:
- Real Firebase backend
- Gemini AI integration
- Voice search
- Interactive UI
- 10+ product categories

**That's already more than most hackathon projects!** 💪

---

## 📞 Quick Help

**Check backend status:**
```bash
curl http://localhost:5000/api/user-preferences
```

**Check frontend:**
Open http://localhost:3000

**View console logs:**
- Backend: Terminal where npm start is running
- Frontend: Browser DevTools Console

---

**You've got this! 🌟**
