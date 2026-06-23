# AI Travel Planner - Testing Checklist

This checklist helps you verify the application is working correctly both locally and after deployment.

## ✅ Pre-Deployment Local Testing

### Environment Setup
- [ ] Backend `.env` file created with all required variables
- [ ] Frontend `.env.local` file created
- [ ] MongoDB Atlas cluster created and connection tested
- [ ] Gemini API key obtained and verified
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm packages installed (`npm install` in both directories)

### Backend Server
- [ ] Backend starts without errors: `npm run dev`
- [ ] Server listening on http://localhost:5000
- [ ] Health check endpoint works: GET http://localhost:5000/api/health
- [ ] MongoDB connection successful (check console logs)
- [ ] No CORS errors in backend logs

### Frontend Server
- [ ] Frontend starts without errors: `npm run dev`
- [ ] Frontend accessible at http://localhost:3000
- [ ] Homepage loads with sign up/login buttons
- [ ] No console errors in browser DevTools

## 🧪 Authentication Testing

### Registration
- [ ] Navigate to http://localhost:3000/register
- [ ] Create account with valid email and password
- [ ] Successfully registered message appears or redirects to dashboard
- [ ] JWT token stored in localStorage
- [ ] Cannot register with existing email (error message displayed)
- [ ] Password mismatch validation works
- [ ] Can navigate to login page

### Login
- [ ] Navigate to http://localhost:3000/login
- [ ] Login with registered email/password
- [ ] Successfully login and redirect to dashboard
- [ ] JWT token stored in localStorage
- [ ] Cannot login with wrong password (error message)
- [ ] Cannot login with non-existent email (error message)
- [ ] Can navigate to signup page

### Authentication Enclave
- [ ] Logout from dashboard
- [ ] Try accessing `/dashboard` directly - redirected to `/login`
- [ ] Try accessing protected endpoints without token:
  ```bash
  curl -X GET http://localhost:5000/api/trips
  # Expected: 401 Unauthorized
  ```

## 🗺️ Trip Generation Testing

### Create New Trip
- [ ] Navigate to dashboard
- [ ] Fill in CreateTripForm with:
  - Destination: "Tokyo"
  - Duration: 5 days
  - Budget Tier: "Medium"
  - Interests: "hiking, food, culture"
- [ ] Click "Generate AI Trip"
- [ ] Loading indicator appears
- [ ] Trip appears in sidebar within 10-15 seconds
- [ ] Itinerary has exactly 5 days
- [ ] Each day has activities
- [ ] Budget breakdown is populated
- [ ] Packing list is generated

### Verify Trip Data
- [ ] Trip title matches destination
- [ ] Duration shows correct number of days
- [ ] Budget tier displays correctly
- [ ] Total estimated budget is > 0
- [ ] All cost categories (food, transport, accommodation, activities) have values
- [ ] Packing items are relevant to destination (check console for values)

### Different Budget Tiers
- [ ] Create trip with "Low" budget → costs are lower
- [ ] Create trip with "High" budget → costs are higher
- [ ] Compare total budgets between tiers
- [ ] Low < Medium < High

## ✏️ Trip Editing Testing

### Add Activity
- [ ] Select a day in itinerary
- [ ] Enter activity name in input field
- [ ] Click "Add" button
- [ ] Activity appears in day activities list
- [ ] Activity has empty description and $0 cost (as expected)
- [ ] Can add multiple activities to same day

### Remove Activity
- [ ] Hover over activity
- [ ] Click "✕" button
- [ ] Activity is removed from list
- [ ] Changes save to database
- [ ] List updates without page reload

## 💼 Packing List Testing

### Interactive Checklist
- [ ] Packing list displays all items
- [ ] Items are grouped by category
- [ ] Category icons display correctly
- [ ] Click item checkbox to toggle
- [ ] Item strikethrough when marked as packed
- [ ] Uncheck item to mark as unpacked
- [ ] Changes persist in database
- [ ] Refresh page - checked state is maintained

### Packing Categories
- [ ] Documents category shows documents/passports
- [ ] Clothing category shows clothes appropriate for climate
- [ ] Gear category shows equipment
- [ ] Each category has multiple items

## 💰 Budget Display Testing

### Budget Ledger
- [ ] Accommodation cost displays
- [ ] Food cost displays
- [ ] Activities cost displays
- [ ] Transport cost displays
- [ ] Total is sum of all categories
- [ ] Costs are formatted with $ sign
- [ ] Numbers are reasonable for destination/tier

### Multiple Trips
- [ ] Create 3-4 different trips
- [ ] Each has different budget amounts
- [ ] Switching between trips updates budget display
- [ ] All trips persist in sidebar

## 👥 User Isolation Testing

### User A
- [ ] Login as User A (user.a@example.com)
- [ ] Create trip "Paris"
- [ ] Verify trip appears in User A's sidebar
- [ ] Note trip ID from database or URL

### User B
- [ ] Open new incognito window
- [ ] Login as User B (user.b@example.com)
- [ ] Dashboard is empty (no trips visible)
- [ ] Try to access User A's trip directly via URL (should fail)
- [ ] Database query confirms userId isolation

### Verify Backend Isolation
```bash
# With User A's JWT token
curl -X GET http://localhost:5000/api/trips \
  -H "Authorization: Bearer <USER_A_TOKEN>"
# Returns only User A's trips

# With User B's JWT token
curl -X GET http://localhost:5000/api/trips \
  -H "Authorization: Bearer <USER_B_TOKEN>"
# Returns only User B's trips (or empty if no trips)
```

## 🔄 API Resilience Testing

### Gemini API Error Handling
- [ ] Temporarily set invalid `GEMINI_API_KEY`
- [ ] Try to generate trip
- [ ] Check backend console for retry messages
- [ ] User sees error message instead of crash
- [ ] Restore correct API key

### Exponential Backoff Verification
- [ ] Monitor console during trip generation
- [ ] Should see retry messages with increasing delays
- [ ] Pattern: 1s, 2s, 4s, 8s, 16s delays
- [ ] After max retries, graceful error to user

## 📱 Responsive Design Testing

### Desktop View
- [ ] Sidebar and main content in 3-column layout
- [ ] All text readable
- [ ] Buttons/inputs properly sized
- [ ] Scrolling works smoothly

### Tablet View (768px)
- [ ] Layout remains usable
- [ ] Cards stack appropriately
- [ ] Touch targets are large enough

### Mobile View (375px)
- [ ] Single column layout
- [ ] Cards stack vertically
- [ ] Text is readable without zooming
- [ ] Input fields are properly sized
- [ ] Buttons are easily clickable

### Responsive breakpoints
- [ ] Sidebar collapses at smaller widths (if implemented)
- [ ] Packing list shows 1-2 columns based on screen size
- [ ] Cards are readable on all sizes

## 🗑️ Deletion Testing

### Delete Trip
- [ ] Select a trip from sidebar
- [ ] Look for delete option
- [ ] Click delete
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Trip removed from sidebar immediately
- [ ] Cannot access deleted trip via URL
- [ ] Database confirms deletion

### Delete Activity
- [ ] Select trip with multiple activities
- [ ] Click ✕ on an activity
- [ ] Activity removed from list
- [ ] Other activities in same day remain
- [ ] Other days unaffected

## 🔐 Security Testing

### Token Expiration
- [ ] Token has 7-day expiration (if checking `jwt.decode()`)
- [ ] Cannot use expired token (implement refresh if needed)
- [ ] Logout removes token from localStorage

### Password Storage
- [ ] Check backend - passwords are hashed (not plaintext)
- [ ] Login works with correct password
- [ ] Login fails with incorrect password

### CORS Headers
- [ ] Frontend can call backend
- [ ] Random origin cannot call backend API
- [ ] Proper CORS headers in responses

## 📊 Performance Testing

### Trip Generation Time
- [ ] Generate trip takes 10-30 seconds
- [ ] UI remains responsive during generation
- [ ] Loading indicator shows progress

### Page Load Time
- [ ] Dashboard loads in < 3 seconds
- [ ] Login page loads immediately
- [ ] No unnecessary re-renders

### Database Queries
- [ ] Getting user's trips is fast (< 1 second)
- [ ] Updating trip is fast (< 1 second)
- [ ] Filtering by userId is efficient

## 🚀 Deployment Testing

### Backend Deployment
- [ ] Backend deployed to production URL
- [ ] Health check endpoint works: GET https://backend-url.com/api/health
- [ ] Can reach database from deployed server
- [ ] Gemini API calls work from server
- [ ] CORS allows frontend origin

### Frontend Deployment
- [ ] Frontend deployed to production URL
- [ ] Homepage loads correctly
- [ ] Can register new account
- [ ] Can login with created account
- [ ] Can generate trips
- [ ] Can edit trips

### End-to-End Production Test
- [ ] Register on deployed app
- [ ] Generate new trip
- [ ] Edit activities
- [ ] Update packing list
- [ ] Create multiple trips
- [ ] Delete a trip
- [ ] Logout and login

## 🐛 Error Handling

### Graceful Errors
- [ ] Invalid email shows error
- [ ] Empty form fields show validation
- [ ] Network errors show message to user
- [ ] Invalid API key shows user-friendly error
- [ ] Database connection error handled gracefully

### Error Messages
- [ ] Error messages are clear and helpful
- [ ] Error messages don't expose sensitive data
- [ ] User can recover from errors

## 📝 Data Validation

### Input Validation
- [ ] Destination cannot be empty
- [ ] Duration must be 1-30 days
- [ ] Budget tier must be valid option
- [ ] Email must be valid format
- [ ] Password meets minimum requirements

### Response Validation
- [ ] Trip response has all required fields
- [ ] Activities have all fields
- [ ] Budget totals are correct
- [ ] No null/undefined critical fields

## 🎯 Final Sign-Off

- [ ] All tests above passed
- [ ] Application ready for production
- [ ] Documentation is complete
- [ ] README is accurate
- [ ] Deployment instructions work
- [ ] Team has access to environment variables
- [ ] Monitoring/logging is set up (if applicable)

---

**Note:** Each checkbox represents a specific test case. All tests should pass before considering the application production-ready.
