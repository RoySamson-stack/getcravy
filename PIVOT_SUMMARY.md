# 🎯 GoEat Pivot Summary

## ✅ What's Been Updated

### Documentation
- ✅ Created `PIVOT_PLAN.md` - Complete pivot strategy and roadmap
- ✅ Updated `PROJECT_DOCUMENTATION.md` - Reflected new vision and features
- ✅ Updated `README.md` - Changed description and features list
- ✅ Created initial TODO list for 3-week launch timeline

### Project Status
- ✅ Existing codebase preserved (video features archived for future)
- ✅ Authentication system intact
- ✅ Restaurant discovery foundation ready
- ✅ Dark mode working
- ✅ Navigation structure ready

---

## 🚧 What Needs to Be Built (Week 1: Backend)

### Database Models (Days 1-2)
1. **Event Model**
   - Fields: title, description, date, time, endTime, price, location, latitude, longitude, capacity, attendeesCount, eventType, imageUrl, restaurantId, userId
   - Relationships: belongsTo Restaurant, belongsTo User, hasMany EventAttendees

2. **EventAttendee Model**
   - Fields: userId, eventId, status (going/interested)
   - Relationships: belongsTo User, belongsTo Event

3. **Deal Model**
   - Fields: title, description, discount, dayOfWeek, startTime, endTime, validFrom, validUntil, restaurantId
   - Relationships: belongsTo Restaurant

### API Endpoints (Days 3-4)
1. **Events API**
   - `GET /api/events` - List all events (with filters)
   - `GET /api/events/:id` - Get single event
   - `POST /api/events` - Create event (protected)
   - `POST /api/events/:id/attend` - Mark as going/interested
   - `DELETE /api/events/:id/attend` - Remove attendance
   - `GET /api/events/:id/attendees` - Get attendees list

2. **Deals API**
   - `GET /api/deals/today` - Get today's deals
   - `GET /api/deals/this-week` - Get this week's deals
   - `GET /api/restaurants/:id/deals` - Get restaurant deals
   - `POST /api/deals` - Create deal (protected - restaurant owners)

3. **Enhanced Restaurant API**
   - Update `GET /api/restaurants/:id` to include events
   - Add events count to restaurant listings

### Database Seeding (Days 5-7)
- Seed 20 restaurants (mix of types and neighborhoods)
- Seed 30-40 events (mix of event types)
- Seed sample deals (happy hours, daily specials)
- Test all endpoints
- Fix bugs

---

## 🎨 What Needs to Be Built (Week 2: Frontend)

### Core Screens (Days 1-3)
1. **Redesign HomeScreen**
   - Featured events carousel at top
   - Today's deals section
   - Browse by vibe (Party, Date Night, Casual, Fine Dining, Family, Brunch)
   - This weekend's events
   - Featured restaurants
   - Near you section with map preview

2. **Build EventsScreen**
   - List all events
   - Filters: This Week, Food Festivals, Happy Hours, Live Music
   - Event cards with date, time, price, location, attendee count
   - Pull to refresh
   - Infinite scroll

3. **Build EventDetailScreen**
   - Full event details
   - Restaurant information
   - Attendee count
   - "Going" / "Interested" buttons
   - Share to WhatsApp button
   - Add to calendar button
   - Map showing event location

4. **Update RestaurantScreen**
   - Add "Upcoming Events" section
   - Show events at this restaurant
   - Add "Open Now" indicator
   - Enhance with deals section

### Features (Days 4-5)
1. **Event Attendance**
   - Mark as "Going" / "Interested"
   - Update attendee count
   - Show in user's bookings

2. **WhatsApp Integration**
   - Deep linking for restaurant contact
   - Share events to WhatsApp

3. **Map View**
   - Show restaurants and events as markers
   - Filter by type
   - Tap marker to see details

4. **Vibe-Based Browsing**
   - Filter restaurants/events by vibe
   - Visual categories

### Polish (Days 6-7)
1. **Open Now Indicators**
   - Check restaurant hours
   - Show "Open Now" badge
   - Real-time status

2. **Event Countdown Timers**
   - Show time until event starts
   - "Starts in X hours" display

3. **Push Notifications Setup**
   - Event reminders
   - New events near you
   - Deal notifications

4. **Dark Mode Refinements**
   - Ensure all new screens support dark mode
   - Consistent theming

5. **Loading States & Error Handling**
   - Skeleton loaders
   - Error messages
   - Empty states

---

## 📋 What Needs to Be Built (Week 3: Testing & Launch)

### Internal Testing (Days 1-2)
- Test all user flows
- Fix critical bugs
- Test on multiple devices (iPhone, Android, tablet)
- Performance optimization
- Check offline behavior

### Beta Testing (Days 3-4)
- Deploy to TestFlight (iOS)
- Deploy to internal testing (Android)
- Recruit 20-30 beta testers
- Gather feedback
- Make quick fixes

### Launch Preparation (Days 5-7)
- Create app store listings
- Prepare marketing materials
- Finalize restaurant partnerships
- Schedule launch event
- Brief support team

---

## 🗂️ Code Organization

### Backend Structure
```
backend/
├── src/
│   ├── models/
│   │   ├── Event.js          # NEW
│   │   ├── EventAttendee.js  # NEW
│   │   └── Deal.js           # NEW
│   ├── controllers/
│   │   ├── eventController.js    # NEW
│   │   └── dealController.js     # NEW
│   ├── routes/
│   │   ├── eventRoutes.js    # NEW
│   │   └── dealRoutes.js     # NEW
│   └── config/
│       ├── seedEvents.js     # NEW
│       └── seedDeals.js      # NEW
```

### Frontend Structure
```
screens/
├── HomeScreen.tsx            # REDESIGN
├── EventsScreen.tsx          # NEW
├── EventDetailScreen.tsx     # NEW
├── RestaurantScreen.tsx      # UPDATE
└── BookingsScreen.tsx        # NEW (or update existing)

services/
├── eventAPI.ts               # NEW
└── dealAPI.ts                # NEW

components/
├── events/
│   ├── EventCard.tsx        # NEW
│   ├── EventFilters.tsx     # NEW
│   └── EventCountdown.tsx   # NEW
└── deals/
    └── DealCard.tsx         # NEW
```

---

## 🎯 Immediate Next Steps

### Today
1. ✅ Documentation updated
2. ✅ TODO list created
3. ⏭️ Start building Event model in backend
4. ⏭️ Create Event migration
5. ⏭️ Set up Event associations

### This Week (Backend Focus)
- Day 1-2: Database models and migrations
- Day 3-4: API endpoints
- Day 5-7: Testing and seeding

### Next Week (Frontend Focus)
- Day 1-3: Core screens
- Day 4-5: Features
- Day 6-7: Polish

### Week 3 (Launch Prep)
- Days 1-2: Internal testing
- Days 3-4: Beta testing
- Days 5-7: Launch preparation

---

## 📝 Notes

### What's Being Archived (Not Deleted)
- Video feed components (can be reused later for Stories)
- Video API endpoints (can be adapted for event recaps)
- Video models (can be repurposed for event media)

### What's Being Kept
- Authentication system
- Restaurant discovery
- User profiles
- Dark mode
- Navigation structure
- Location services

### What's Being Simplified
- Remove/simplify cart and checkout (focus on bookings)
- Remove complex video features
- Focus on events and discovery

---

## 🚀 Ready to Start?

The pivot plan is complete. The next step is to start building the Event model in the backend. 

**Command to start backend:**
```bash
cd backend && npm run dev
```

**First task:** Create `backend/src/models/Event.js`

Let's build this! 🎉



