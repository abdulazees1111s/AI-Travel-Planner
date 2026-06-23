# 🚀 AI Travel Planner - Complete Setup Guide

A production-ready, multi-user AI-powered travel planning application featuring automatic itinerary generation, budget management, and an innovative weather-aware packing assistant.

## 📋 Prerequisites

- **Node.js**: Version 18.x or 20.x (LTS) - [Download](https://nodejs.org/)
- **npm**: Bundled with Node.js
- **MongoDB Atlas Account**: Free tier - [Create here](https://www.mongodb.com/cloud/atlas)
- **Google Gemini API Key**: Free - [Get here](https://ai.google.dev/tutorials/setup)
- **VS Code**: Optional but recommended - [Download](https://code.visualstudio.com/)

## 📁 Project Structure

```
ai-travel-planner/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB Connection
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Trip.js            # Trip schema with all nested models
│   ├── controllers/
│   │   ├── authController.js  # Registration and login
│   │   └── tripController.js  # Trip CRUD and AI generation
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── tripRoutes.js      # Trip endpoints
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── CreateTripForm.tsx
│   │   │   ├── ItineraryCard.tsx
│   │   │   └── PackingList.tsx
│   │   ├── utils/
│   │   │   └── api.ts         # Axios client with auth
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript interfaces
│   │   └── globals.css        # Tailwind CSS
│   ├── .env.example
│   ├── .gitignore
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── README.md
└── .gitignore
```

## 🔧 Local Development Setup

### Step 1: Clone or Download the Project

```bash
cd your-workspace
```

### Step 2: Set Up Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/ai_travel_planner?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_random_string_here_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Gemini API Configuration
GEMINI_API_KEY=your_google_gemini_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**To get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Go to "Database" → "Connect" → "Drivers"
4. Copy the connection string and replace `<username>`, `<password>`, and `<database>`

**To get Gemini API Key:**
1. Visit [Google AI Studio](https://ai.google.dev/tutorials/setup)
2. Click "Get API Key"
3. Create a new API key
4. Copy and paste it to `.env`

Start the backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Set Up Frontend

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🧪 Testing the Application Locally

### Test 1: Authentication Enclave

1. Navigate to `http://localhost:3000/register`
2. Create a new account with email and password
3. You should be redirected to the dashboard
4. Logout and try to access `/dashboard` directly - you should be redirected to `/login`

**Expected Result:** HTTP 401 Unauthorized if accessing without a token

### Test 2: User Data Isolation

1. Create User A with email `user.a@example.com`
2. Create a trip in User A's account
3. Open a new incognito window and create User B with email `user.b@example.com`
4. User B's dashboard should show an empty trips list
5. User B cannot access User A's trips

### Test 3: AI Generation Resilience

1. Set an invalid `GEMINI_API_KEY` temporarily
2. Try to generate a trip
3. Check backend console - you should see retry messages with exponential backoff

**Expected Behavior:**
```
Rate limited. Retrying in 1000ms...
Rate limited. Retrying in 2000ms...
Rate limited. Retrying in 4000ms...
```

### Test 4: Trip Management

1. Create a trip with destination "Tokyo" for 5 days
2. Add activities to different days
3. Check packing list is populated with weather-appropriate items
4. Delete an activity - it should update immediately
5. Delete the entire trip - it should be removed from the sidebar

## 🚀 Deployment

### Backend Deployment (Render.com)

1. **Prepare Repository:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Render:**
   - Go to [Render.com](https://render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as the root directory
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Add Environment Variables:**
   - Click "Environment"
   - Add all variables from your local `.env`:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `GEMINI_API_KEY`
     - `FRONTEND_URL=https://frontend-phi-flame-38.vercel.app`
     - `NODE_ENV=production`
     - `PORT=5000`

4. **Deploy:** Click "Deploy"

Your backend will be available at `https://backend-lovat-seven-54.vercel.app`

### Frontend Deployment (Vercel)

1. **Push Frontend to GitHub:**
   ```bash
   cd frontend
   git add .
   git commit -m "Frontend setup"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [Vercel.com](https://vercel.com/)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `frontend` folder
   - Add environment variable:
     - `NEXT_PUBLIC_API_URL=https://backend-lovat-seven-54.vercel.app`

3. **Deploy:** Click "Deploy"

Your frontend will be available at `https://frontend-phi-flame-38.vercel.app`

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a strong, random string in production
- [ ] Use environment variables for all sensitive data
- [ ] Enable CORS with specific frontend URL only
- [ ] Set `NODE_ENV=production` on backend
- [ ] Use HTTPS for all production URLs
- [ ] Keep API keys private and never commit them
- [ ] Implement rate limiting for API routes
- [ ] Add HTTPS to MongoDB connection string
- [ ] Use strong, hashed passwords with bcryptjs
- [ ] Validate all user inputs on backend

## 📊 API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login existing user

### Trips (All require JWT token)
- **POST** `/api/trips` - Create new AI-generated trip
- **GET** `/api/trips` - Get all user's trips
- **GET** `/api/trips/:tripId` - Get specific trip
- **PUT** `/api/trips/:tripId` - Update trip (itinerary, packing list, etc.)
- **DELETE** `/api/trips/:tripId` - Delete trip

## 🎯 Key Features

### 1. AI-Powered Trip Generation
- Leverages Google Gemini 2.5 Flash API
- Generates realistic budgets based on tier
- Creates day-by-day itineraries with activities
- Returns structured JSON with cost estimates

### 2. Multi-User Architecture
- User isolation via MongoDB queries
- JWT-based authentication
- Secure password hashing with bcryptjs
- Role-based access control (future enhancement)

### 3. Dynamic Itinerary Editing
- Add/remove activities in real-time
- Update activity details
- Modify day schedules
- All changes saved to database

### 4. Weather-Aware Packing Assistant (Creative Feature)
- AI generates packing items based on destination climate
- Categorizes items (Documents, Clothing, Gear, Other)
- Interactive checklist with toggle functionality
- Syncs with database for persistence

### 5. Budget Management
- Detailed cost breakdown:
  - Accommodation
  - Food
  - Activities
  - Transportation
- Total budget calculation
- Budget tier-aware pricing

## 🔄 Example API Flow

```
1. User Signup
   POST /api/auth/register
   → Server hashes password, creates user, returns JWT

2. User Creates Trip
   POST /api/trips (with JWT token)
   → Server sends prompt to Gemini API
   → Gemini generates structured JSON
   → Server saves to MongoDB with userId
   → Returns populated trip object

3. User Edits Activity
   PUT /api/trips/:tripId (with JWT token)
   → Server verifies user owns trip (userId check)
   → Updates specific field in database
   → Returns updated trip

4. User Views Trips
   GET /api/trips (with JWT token)
   → Server queries MongoDB for trips where userId matches
   → Returns user's trips only (enforced on backend)
```

## 🐛 Troubleshooting

### "Cannot GET /api/trips"
- Check MongoDB connection string in `.env`
- Ensure backend server is running (`npm run dev`)
- Verify port 5000 is not blocked

### "CORS error when calling API"
- Check `FRONTEND_URL` in backend `.env`
- Ensure CORS middleware is configured correctly
- Verify frontend is calling correct API URL

### "Gemini API Error"
- Verify `GEMINI_API_KEY` is correct
- Check API key has proper permissions
- Review rate limiting (free tier: 60 requests/minute)
- Check token quota in Google AI Studio

### "MongoDB connection timeout"
- Verify connection string format
- Check IP whitelist in MongoDB Atlas (add `0.0.0.0/0` for development)
- Ensure cluster is running
- Check network connectivity

### "Token Invalid or Expired"
- Clear browser localStorage
- Re-login to get new token
- Check JWT_SECRET matches between frontend and backend

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Schema Docs](https://mongoosejs.com/docs/guide.html)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [JWT Authentication](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for signing tokens | `your_secure_secret_key` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:3000` |

### Frontend (.env.local)
| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |

## 🎓 Architecture Highlights

1. **Monorepo Structure**: Backend and frontend co-located
2. **TypeScript**: Full type safety on frontend
3. **JWT Auth**: Stateless authentication
4. **User Isolation**: Every query includes userId check
5. **Error Handling**: Exponential backoff for API resilience
6. **Responsive Design**: Mobile-first with Tailwind CSS
7. **Real-time Updates**: Interactive UI without page reloads
8. **Database Optimization**: Indexed queries for performance

## 🚢 Next Steps

1. Add user profile management
2. Implement social sharing features
3. Add trip collaboration (multiple users)
4. Integrate real booking APIs (Airbnb, Booking.com)
5. Add expense tracking during trips
6. Implement weather API integration
7. Add review/rating system
8. Create mobile app with React Native

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review error messages in browser console and backend logs
3. Verify all environment variables are set correctly
4. Check that services (MongoDB, Gemini API) are accessible

---

**Happy Planning! ✈️🌍**
