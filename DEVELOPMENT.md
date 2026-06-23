# Development Guide

Useful commands, tips, and workflows for developing the AI Travel Planner.

## 🚀 Quick Start Commands

### Backend

```bash
# Initial setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials

# Development (with auto-reload)
npm run dev

# Production
npm start

# Install new package
npm install package-name

# Check for vulnerabilities
npm audit
npm audit fix
```

### Frontend

```bash
# Initial setup
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with API URL

# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Lint code
npm run lint
```

## 📁 Project File Structure

```
backend/
├── config/db.js           # Database connection
├── middleware/
│   └── auth.js            # JWT verification
├── models/
│   ├── User.js            # User schema
│   └── Trip.js            # Trip schema
├── controllers/
│   ├── authController.js  # Auth logic
│   └── tripController.js  # Trip logic
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── tripRoutes.js      # Trip endpoints
├── .env                   # Environment variables
├── .env.example           # Example config
├── package.json           # Dependencies
└── server.js              # Entry point

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Homepage
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── dashboard/page.tsx
│   ├── components/
│   │   ├── CreateTripForm.tsx
│   │   ├── ItineraryCard.tsx
│   │   └── PackingList.tsx
│   ├── utils/api.ts       # API client
│   ├── types/index.ts     # TypeScript types
│   └── globals.css        # Global styles
├── .env.local             # Frontend config
├── package.json
└── tsconfig.json
```

## 🔧 Development Workflows

### Adding a New API Endpoint

1. **Create Controller Method** (`backend/controllers/tripController.js`):
```javascript
export const myNewEndpoint = async (req, res) => {
  try {
    // Your logic here
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};
```

2. **Add Route** (`backend/routes/tripRoutes.js`):
```javascript
tripRouter.post('/my-endpoint', myNewEndpoint);
```

3. **Call from Frontend** (`frontend/src/components/MyComponent.tsx`):
```typescript
const response = await api.post('/trips/my-endpoint', data);
```

### Adding a New Frontend Component

1. **Create Component** (`frontend/src/components/MyComponent.tsx`):
```typescript
'use client';
import React from 'react';

export default function MyComponent() {
  return <div>Component content</div>;
}
```

2. **Import in Page** (`frontend/src/app/dashboard/page.tsx`):
```typescript
import MyComponent from '@/components/MyComponent';
```

3. **Use in JSX**:
```typescript
<MyComponent />
```

## 🐛 Debugging Tips

### Backend Debugging

```bash
# View server logs
npm run dev

# Use console.log to debug
console.log('Debug:', variable);

# Common issues:
# 1. MongoDB not connected → Check MONGO_URI
# 2. CORS error → Check FRONTEND_URL
# 3. API key invalid → Check GEMINI_API_KEY
```

### Frontend Debugging

```bash
# Open browser DevTools (F12)
# 1. Console tab → See JavaScript errors
# 2. Network tab → See API requests
# 3. Application tab → Check localStorage for token
# 4. React DevTools extension → Debug components

# Common issues:
# 1. API 401 error → Token invalid/expired
# 2. API 404 error → Endpoint doesn't exist
# 3. CORS error → Backend URL mismatch
```

### API Testing with cURL

```bash
# Test without auth (should fail)
curl http://localhost:5000/api/trips

# Test with auth
BEARER_TOKEN="your_jwt_token_here"
curl -H "Authorization: Bearer $BEARER_TOKEN" \
  http://localhost:5000/api/trips

# POST request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📝 Environment Variables

### Backend (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGO_URI` | MongoDB connection | `mongodb+srv://...` |
| `JWT_SECRET` | Token signing key | Random 32-char string |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `GEMINI_API_KEY` | Google API key | `AIza...` |
| `FRONTEND_URL` | Frontend origin | `http://localhost:3000` |

### Frontend (.env.local)

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend URL | `http://localhost:5000` |

## 🧪 Testing Endpoints

### Authentication Endpoints

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login (returns token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

### Trip Endpoints

```bash
TOKEN="your_jwt_token_here"

# Get all trips
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/trips

# Create trip
curl -X POST http://localhost:5000/api/trips \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Tokyo",
    "durationDays": 5,
    "budgetTier": "Medium",
    "interests": ["hiking", "food", "culture"]
  }'

# Get single trip
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/trips/TRIP_ID_HERE

# Update trip
curl -X PUT http://localhost:5000/api/trips/TRIP_ID_HERE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris"
  }'

# Delete trip
curl -X DELETE http://localhost:5000/api/trips/TRIP_ID_HERE \
  -H "Authorization: Bearer $TOKEN"
```

## 🎨 Frontend Development Tips

### Styling with Tailwind CSS

```typescript
// Classes automatically available
<div className="bg-slate-900 text-white p-6 rounded-lg">
  <h1 className="text-2xl font-bold">Heading</h1>
</div>
```

### Common Tailwind Patterns

```typescript
// Responsive grid
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

// Responsive text
<p className="text-sm md:text-base lg:text-lg">

// Dark mode (already setup)
<div className="bg-slate-950 text-slate-100">

// Gradient text
<h1 className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
```

### Using React Hooks

```typescript
import React, { useState, useEffect } from 'react';

export default function MyComponent() {
  const [state, setState] = useState('initial');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Run on component mount
    fetchData();
  }, []);

  return <div>Content</div>;
}
```

## 🚀 Performance Optimization

### Frontend
- Lazy load components with `React.lazy()`
- Use `useMemo` for expensive calculations
- Optimize images
- Code splitting in Next.js (automatic)

### Backend
- Add indexes to frequently queried fields
- Cache database queries
- Implement rate limiting
- Use compression middleware

### Database
```javascript
// Add indexes in Trip.js model
TripSchema.index({ userId: 1 });
TripSchema.index({ createdAt: -1 });
```

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-new-feature

# Make changes
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/add-new-feature

# Create Pull Request on GitHub
# Merge to main after review

# Pull latest changes
git pull origin main
```

## 📚 Useful Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Schema](https://mongoosejs.com/docs/guide.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) - DB explorer
- [VS Code Extensions](https://code.visualstudio.com/docs/editor/extension-marketplace)
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - Thunder Client - API tester
  - MongoDB for VS Code

## 🆘 Troubleshooting

### "Cannot find module"
```bash
# Reinstall packages
rm -rf node_modules package-lock.json
npm install
```

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID PORT_NUMBER /F

# macOS/Linux
lsof -i :5000
kill -9 PORT_NUMBER
```

### "MongoDB connection refused"
```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Test with mongo CLI or Compass
```

### "JWT token invalid"
```bash
# Token might be expired (7 days)
# Or JWT_SECRET mismatch between frontend/backend
# Re-login to get new token
```

## 💡 Code Quality

### Lint frontend code
```bash
npm run lint
```

### Format code with Prettier (if configured)
```bash
npx prettier --write .
```

### Check for TypeScript errors
```bash
npx tsc --noEmit
```

## 🎓 Best Practices

1. **Always validate on backend** - Never trust frontend validation alone
2. **Use TypeScript** - Catch errors before runtime
3. **Handle errors gracefully** - Show meaningful messages to users
4. **Keep secrets in .env** - Never commit API keys
5. **Test thoroughly** - Manual and automated testing
6. **Comment complex code** - Help future maintainers
7. **Use meaningful variable names** - Self-documenting code
8. **Keep functions small** - Single responsibility principle

---

Happy coding! 🎉
