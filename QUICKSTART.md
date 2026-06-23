# AI Travel Planner

A complete, production-ready AI-powered travel planning application built with Node.js, Express, MongoDB, Next.js, and Google Gemini API.

## Features

- ✈️ AI-generated itineraries using Gemini API
- 👥 Multi-user architecture with JWT authentication  
- 💼 Smart packing assistant with weather awareness
- 💰 Dynamic budget management
- 📝 Full CRUD for trips and activities
- 🔐 Secure password hashing and user isolation
- 📱 Responsive Next.js frontend with Tailwind CSS
- ⚡ Exponential backoff retry logic for API resilience

## Quick Start

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

2. **Frontend Setup** (in another terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

3. Access the app at `http://localhost:3000`

## Configuration

### Required Environment Variables

**Backend (.env):**
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT signing
- `GEMINI_API_KEY` - Google Gemini API key
- `FRONTEND_URL` - Frontend URL for CORS

**Frontend (.env.local):**
- `NEXT_PUBLIC_API_URL` - Backend API URL

See `.env.example` files for complete examples.

## Architecture

```
Frontend (Next.js)
    ↓ (REST API with JWT)
Backend (Express.js)
    ↓
├─ MongoDB (User & Trip data)
├─ Gemini API (AI itinerary generation)
└─ JWT Auth (User isolation)
```

## Project Structure

- `backend/` - Express.js API server
- `frontend/` - Next.js React application

For detailed setup and deployment instructions, see [README.md](README.md)

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Trips (Protected)
- `POST /api/trips` - Generate new trip
- `GET /api/trips` - Get user's trips
- `GET /api/trips/:tripId` - Get specific trip
- `PUT /api/trips/:tripId` - Update trip
- `DELETE /api/trips/:tripId` - Delete trip

## Deployment

- **Backend**: Deploy to Render.com or Railway
- **Frontend**: Deploy to Vercel

See README.md for detailed deployment instructions.

## Security

- User data isolation via MongoDB queries
- JWT-based authentication
- Bcryptjs password hashing
- CORS protection
- Environment variable configuration

## Tech Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- Next.js 14 with React 18
- TypeScript
- Tailwind CSS
- Axios for API calls

**AI/Services:**
- Google Gemini 2.5 Flash API
- MongoDB Atlas

## License

Open source for educational purposes.
