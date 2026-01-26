# 📚 GoEat - Complete Project Documentation

## 🎯 Project Overview

**GoEat** is a restaurant and events discovery platform designed specifically for Nairobi, Kenya. It helps Nairobians discover the best restaurants and food events happening right now, solving the problem of finding what's happening in the city's food scene.

### Vision Statement
"Stop scrolling Instagram for hours. Find the best restaurants and food events in Nairobi—all in one place."

### Core Concept
- **Events-First Discovery**: Users discover restaurants through upcoming events (wine tastings, festivals, happy hours)
- **Real-Time Information**: See what's happening TODAY and this weekend
- **Kenyan-Focused**: Built specifically for Nairobi neighborhoods, restaurants, and food culture
- **Vibe-Based Browsing**: Browse by mood/occasion (Party, Date Night, Casual, Fine Dining, Family, Brunch)
- **Practical & Actionable**: Direct contact (Call, WhatsApp), reservations, and event attendance tracking

---

## 🏗️ Architecture Overview

### Technology Stack

#### Frontend (Mobile App)
- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack Navigator)
- **State Management**: React Context API
  - `AuthContext` - User authentication state
  - `ThemeContext` - Light/dark mode theme management
- **Video Playback**: Expo Video (expo-video)
- **Storage**: AsyncStorage for local data persistence
- **Location**: Expo Location for GPS-based features
- **UI Components**: Custom components + Expo Vector Icons

#### Backend (API Server)
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL (running in Docker)
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens) with refresh tokens
- **Security**: 
  - bcrypt for password hashing
  - Helmet for security headers
  - Express Rate Limit for API protection
  - CORS configuration
- **File Upload**: Multer (for future image/video uploads)

#### Database
- **Type**: PostgreSQL 15
- **Container**: Docker (getcravy-postgres)
- **Port**: 5433 (mapped from container port 5432)
- **ORM**: Sequelize for database operations

---

## 📱 Core Features

### 1. User Authentication System ✅
- **Registration**: Users can create accounts with name, email, password, and optional phone number
- **Login**: Secure authentication with JWT tokens
- **Token Management**: 
  - Access tokens for API requests
  - Refresh tokens for token renewal
  - Automatic token refresh on expiration
- **Session Management**: 
  - Inactivity timeout (15 minutes auto-logout)
  - Secure token storage in AsyncStorage
- **User Profile**: 
  - View and edit personal information
  - Manage preferences (dark mode, notifications)
  - Payment methods management
  - Favorites list
  - Order history

### 2. Restaurant Discovery System ✅
- **Browse Restaurants**: 
  - Category-based browsing (Italian, Mexican, Japanese, etc.)
  - Featured restaurants section
  - All restaurants listing
- **Search Functionality**: 
  - Search by restaurant name
  - Search by dish name
  - Search by location
- **Location-Based Discovery**: 
  - GPS-based nearby restaurants
  - Location permissions handling
  - Distance-based sorting
- **Restaurant Details**: 
  - Restaurant profile with images
  - Menu items with prices
  - Ratings and reviews
  - Location and contact information

### 3. Events Discovery System 🚧
- **Events Feed**: 
  - Browse all upcoming food events
  - Filter by: This Week, Food Festivals, Happy Hours, Live Music
  - Event details: date, time, price, location, attendee count
  - "Going" / "Interested" buttons
  - Share event to WhatsApp
  - Add to calendar
- **Event Types**: 
  - Restaurant events (wine tastings, chef's table, themed nights)
  - Food festivals
  - Pop-ups & food trucks
  - Regular specials (happy hours, ladies' nights, brunch)
  - Entertainment + food (live music, comedy, sports viewing)
- **Event Features**: 
  - Real-time attendee count
  - Event countdown timers
  - Push notifications for reminders
  - Calendar integration
  - WhatsApp sharing

### 4. Restaurant Bookings & Reservations ✅
- **Table Reservations**: 
  - Book tables at restaurants
  - Select date, time, party size
  - View reservation status
  - Cancel reservations
- **Event Attendance**: 
  - Mark events as "Going" or "Interested"
  - Track events you're attending
  - Receive reminders before events
- **Booking History**: 
  - View past reservations
  - View events you attended
  - Re-book favorite restaurants

### 5. Theme System ✅
- **Light/Dark Mode**: 
  - System-based (auto)
  - Manual light mode
  - Manual dark mode
- **Theme Persistence**: 
  - Saved to AsyncStorage
  - Persists across app restarts
- **Theme-Aware Components**: 
  - All components adapt to theme
  - Consistent color scheme throughout app

### 6. User Profile Management ✅
- **Personal Information**: 
  - Edit name, email, phone, address
  - Profile picture (placeholder)
- **Preferences**: 
  - Notification settings
  - Dark mode toggle
  - Language selection
  - Delivery time preferences
- **Account Management**: 
  - Change password
  - Payment methods (add/remove/set default)
  - Favorites management
  - Order history
  - Help & support

---

## 🗄️ Database Structure

### Core Models

#### Users
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed with bcrypt)
- `phone` (String, Optional)
- `address` (String, Optional)
- `role` (Enum: 'user', 'restaurant_owner', 'admin')
- `createdAt`, `updatedAt` (Timestamps)

#### Restaurants
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `cuisine` (String)
- `address` (String)
- `city` (String)
- `neighborhood` (String)
- `latitude` (Decimal)
- `longitude` (Decimal)
- `phone` (String)
- `email` (String)
- `rating` (Decimal)
- `priceRange` (Enum: '$', '$$', '$$$', '$$$$')
- `imageUrl` (String)
- `featured` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

#### Events
- `id` (UUID, Primary Key)
- `title` (String, Required)
- `description` (Text, Required)
- `date` (Date, Required)
- `time` (Time, Required)
- `endTime` (Time, Optional)
- `price` (Decimal, Optional - null for free events)
- `location` (String, Required)
- `latitude` (Decimal, Optional)
- `longitude` (Decimal, Optional)
- `capacity` (Integer, Optional)
- `attendeesCount` (Integer, Default: 0)
- `eventType` (Enum: 'restaurant_event', 'festival', 'popup', 'special', 'entertainment')
- `imageUrl` (String, Optional)
- `restaurantId` (UUID, Foreign Key → Restaurants, Optional)
- `userId` (UUID, Foreign Key → Users - event creator)
- `createdAt`, `updatedAt` (Timestamps)

#### EventAttendees
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key → Users)
- `eventId` (UUID, Foreign Key → Events)
- `status` (Enum: 'going', 'interested')
- `createdAt`, `updatedAt` (Timestamps)

#### Deals
- `id` (UUID, Primary Key)
- `title` (String, Required)
- `description` (Text, Optional)
- `discount` (String, Optional - e.g., "20% off", "Buy 1 Get 1")
- `dayOfWeek` (Integer, 0-6, Optional - null for daily deals)
- `startTime` (Time, Optional)
- `endTime` (Time, Optional)
- `validFrom` (Date, Optional)
- `validUntil` (Date, Optional)
- `restaurantId` (UUID, Foreign Key → Restaurants, Required)
- `createdAt`, `updatedAt` (Timestamps)

#### MenuItems
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `price` (Decimal)
- `imageUrl` (String)
- `category` (String)
- `available` (Boolean)
- `restaurantId` (UUID, Foreign Key → Restaurants)
- `createdAt`, `updatedAt` (Timestamps)

#### Reviews
- `id` (UUID, Primary Key)
- `rating` (Integer, 1-5)
- `comment` (Text)
- `userId` (UUID, Foreign Key → Users)
- `restaurantId` (UUID, Foreign Key → Restaurants)
- `createdAt`, `updatedAt` (Timestamps)

#### Reservations
- `id` (UUID, Primary Key)
- `date` (Date)
- `time` (Time)
- `partySize` (Integer)
- `status` (Enum: 'pending', 'confirmed', 'cancelled', 'completed')
- `userId` (UUID, Foreign Key → Users)
- `restaurantId` (UUID, Foreign Key → Restaurants)
- `createdAt`, `updatedAt` (Timestamps)

### Database Relationships
- **User** → **Events** (One-to-Many - event creators)
- **User** → **EventAttendees** (One-to-Many - users attending events)
- **User** → **Reviews** (One-to-Many)
- **User** → **Reservations** (One-to-Many)
- **Restaurant** → **Events** (One-to-Many)
- **Restaurant** → **Deals** (One-to-Many)
- **Restaurant** → **MenuItems** (One-to-Many)
- **Restaurant** → **Reviews** (One-to-Many)
- **Restaurant** → **Reservations** (One-to-Many)
- **Event** → **EventAttendees** (One-to-Many)

---

## 🔌 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
  - Body: `{ name, email, password, phone? }`
  - Returns: `{ success, user, token, refreshToken }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ success, user, token, refreshToken }`
- `POST /api/auth/refresh` - Refresh access token
  - Body: `{ refreshToken }`
  - Returns: `{ success, token }`
- `GET /api/auth/me` - Get current user (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success, user }`

### Restaurant Endpoints
- `GET /api/restaurants` - Get all restaurants
  - Query params: `page`, `limit`, `category`, `city`, `neighborhood`, `search`, `minRating`, `featured`
  - Returns: `{ success, restaurants[], pagination }`
- `GET /api/restaurants/:id` - Get restaurant by ID
  - Returns: `{ success, restaurant }`
- `GET /api/restaurants/featured` - Get featured restaurants
  - Returns: `{ success, restaurants[] }`
- `GET /api/restaurants/nearby` - Get nearby restaurants
  - Query params: `latitude`, `longitude`, `radius?`
  - Returns: `{ success, restaurants[] }`

### Events Endpoints
- `GET /api/events` - Get all events
  - Query params: `page`, `limit`, `eventType?`, `dateFrom?`, `dateTo?`, `latitude?`, `longitude?`, `radius?`
  - Returns: `{ success, events[], pagination }`
- `GET /api/events/:id` - Get single event
  - Returns: `{ success, event }`
- `POST /api/events` - Create event (Protected)
  - Body: `{ title, description, date, time, endTime?, price?, location, latitude?, longitude?, capacity?, eventType, restaurantId?, imageUrl? }`
  - Returns: `{ success, event }`
- `POST /api/events/:id/attend` - Mark as going/interested (Protected)
  - Body: `{ status: 'going' | 'interested' }`
  - Returns: `{ success, attendee }`
- `DELETE /api/events/:id/attend` - Remove attendance (Protected)
  - Returns: `{ success }`
- `GET /api/events/:id/attendees` - Get event attendees
  - Query params: `page`, `limit`, `status?`
  - Returns: `{ success, attendees[], pagination }`

### Deals Endpoints
- `GET /api/deals/today` - Get today's deals
  - Returns: `{ success, deals[] }`
- `GET /api/deals/this-week` - Get this week's deals
  - Returns: `{ success, deals[] }`
- `GET /api/restaurants/:restaurantId/deals` - Get restaurant deals
  - Returns: `{ success, deals[] }`
- `POST /api/deals` - Create deal (Protected - Restaurant owners)
  - Body: `{ title, description?, discount?, dayOfWeek?, startTime?, endTime?, validFrom?, validUntil?, restaurantId }`
  - Returns: `{ success, deal }`

### Menu Endpoints
- `GET /api/restaurants/:restaurantId/menu` - Get restaurant menu
  - Returns: `{ success, menuItems[] }`
- `GET /api/menu/:id` - Get menu item by ID
  - Returns: `{ success, menuItem }`

### Review Endpoints
- `GET /api/restaurants/:restaurantId/reviews` - Get restaurant reviews
  - Query params: `page`, `limit`
  - Returns: `{ success, reviews[], pagination }`
- `POST /api/restaurants/:restaurantId/reviews` - Create review (Protected)
  - Body: `{ rating, comment }`
  - Returns: `{ success, review }`

### Reservation Endpoints
- `GET /api/reservations` - Get user reservations (Protected)
  - Returns: `{ success, reservations[] }`
- `POST /api/reservations` - Create reservation (Protected)
  - Body: `{ restaurantId, date, time, partySize }`
  - Returns: `{ success, reservation }`
- `PUT /api/reservations/:id` - Update reservation (Protected)
  - Body: `{ date?, time?, partySize?, status? }`
  - Returns: `{ success, reservation }`
- `DELETE /api/reservations/:id` - Cancel reservation (Protected)
  - Returns: `{ success }`

---

## 📂 Project Structure

### Frontend Structure
```
getcravy/
├── App.tsx                    # Main app component with navigation
├── index.ts                   # Entry point
├── app.json                   # Expo configuration
├── package.json               # Frontend dependencies
├── tsconfig.json              # TypeScript configuration
├── babel.config.js            # Babel configuration
│
├── assets/                    # Static assets
│   ├── icon.png
│   ├── splash-icon.png
│   └── food.png
│
├── components/                # Reusable components
│   ├── common/
│   │   ├── Button.tsx         # Theme-aware button component
│   │   ├── Input.tsx          # Theme-aware input component
│   │   ├── ErrorMessage.tsx   # Error display component
│   │   └── LoadingSpinner.tsx # Loading indicator
│   ├── restaurant/
│   │   └── RestaurantCard.tsx # Restaurant card component
│   └── video/
│       ├── VideoFeed.tsx      # Main video feed component
│       ├── VideoItemComponent.tsx # Individual video player
│       ├── CommentsModal.tsx  # Comments modal
│       └── HeartAnimation.tsx # Double-tap heart animation
│
├── screens/                   # Screen components
│   ├── LoginScreen.tsx        # User login
│   ├── SignupScreen.tsx       # User registration
│   ├── HomeScreen.tsx         # Restaurant discovery
│   ├── RestaurantScreen.tsx   # Restaurant details
│   ├── CartScreen.tsx         # Shopping cart
│   ├── CheckoutScreen.tsx     # Checkout process
│   ├── OrderConfirmationScreen.tsx # Order confirmation
│   ├── AllRestaurantsScreen.tsx    # All restaurants list
│   ├── ProfileScreen.tsx      # User profile
│   └── VideoFeedScreen.tsx    # TikTok-style video feed
│
├── context/                   # React Context providers
│   ├── AuthContext.tsx        # Authentication state
│   └── ThemeContext.tsx       # Theme management
│
├── services/                  # API service layer
│   ├── api.ts                 # Base API client
│   ├── videoAPI.ts            # Video API calls
│   ├── menuAPI.ts             # Menu API calls
│   ├── reservationAPI.ts     # Reservation API calls
│   └── reviewAPI.ts           # Review API calls
│
├── hooks/                     # Custom React hooks
│   └── useInactivityTimeout.ts # Inactivity timeout hook
│
├── constants/                 # Constants and config
│   ├── colors.ts              # Color constants
│   ├── images.ts              # Image placeholders
│   └── dummyData.ts           # Mock data
│
├── types/                     # TypeScript type definitions
│   └── navigation.ts           # Navigation types
│
└── endpoints/                 # API endpoint definitions
    └── endpoints.ts            # Endpoint constants
```

### Backend Structure
```
backend/
├── src/
│   ├── server.js              # Express server setup
│   │
│   ├── config/                # Configuration files
│   │   ├── database.js        # Sequelize database config
│   │   ├── migrate.js         # Database migrations
│   │   ├── seed.js            # Seed restaurants
│   │   ├── seedUsers.js       # Seed users
│   │   ├── seedMenu.js        # Seed menu items
│   │   └── seedVideos.js      # Seed videos
│   │
│   ├── models/                # Database models
│   │   ├── User.js            # User model
│   │   ├── Restaurant.js      # Restaurant model
│   │   ├── MenuItem.js        # Menu item model
│   │   ├── Review.js          # Review model
│   │   ├── Reservation.js     # Reservation model
│   │   ├── Video.js            # Video model
│   │   ├── VideoLike.js        # Video like model
│   │   ├── VideoComment.js    # Video comment model
│   │   └── associations.js    # Model relationships
│   │
│   ├── controllers/           # Request handlers
│   │   ├── authController.js  # Authentication logic
│   │   ├── restaurantController.js # Restaurant CRUD
│   │   ├── menuController.js  # Menu operations
│   │   ├── reviewController.js # Review operations
│   │   ├── reservationController.js # Reservation operations
│   │   └── videoController.js # Video operations
│   │
│   ├── routes/                # API routes
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── restaurantRoutes.js # Restaurant endpoints
│   │   ├── menuRoutes.js      # Menu endpoints
│   │   ├── reviewRoutes.js    # Review endpoints
│   │   ├── reservationRoutes.js # Reservation endpoints
│   │   └── videoRoutes.js     # Video endpoints
│   │
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # JWT authentication
│   │   └── validation.js      # Input validation
│   │
│   └── utils/                  # Utility functions
│       └── jwt.js             # JWT helper functions
│
├── .env                       # Environment variables
├── package.json               # Backend dependencies
└── README.md                  # Backend documentation
```

---

## 🔄 User Flows

### 1. User Registration & Login Flow
1. User opens app → Sees LoginScreen
2. User taps "Sign Up" → Navigates to SignupScreen
3. User enters name, email, password, phone (optional)
4. Frontend calls `POST /api/auth/register`
5. Backend creates user, hashes password, returns JWT token
6. Frontend stores token in AsyncStorage
7. User is automatically logged in → Navigates to HomeScreen

### 2. Restaurant Discovery Flow
1. User on HomeScreen → Sees featured restaurants
2. User can:
   - Browse by category (tabs)
   - Search restaurants
   - View nearby restaurants (GPS-based)
   - Tap restaurant card → Navigates to RestaurantScreen
3. RestaurantScreen shows:
   - Restaurant details
   - Menu items
   - Reviews
   - Location map
4. User can add items to cart → Navigates to CartScreen

### 3. Events Discovery Flow
1. User opens app → Sees HomeScreen with featured events carousel
2. User can:
   - Browse featured events
   - Filter by vibe (Party, Date Night, Casual, etc.)
   - View today's deals
   - See weekend events
   - Tap "View All Events" → Navigates to EventsScreen
3. EventsScreen shows:
   - All upcoming events
   - Filters (This Week, Festivals, Happy Hours, Live Music)
   - Event cards with date, time, price, location
4. User taps event → Navigates to EventDetailScreen
5. EventDetailScreen shows:
   - Full event details
   - Restaurant information
   - Attendee count
   - "Going" / "Interested" buttons
   - Share to WhatsApp
   - Add to calendar
6. User can mark as "Going" → Event added to their bookings

### 4. Restaurant Booking Flow
1. User views RestaurantScreen → Sees "Reserve Table" button
2. User taps "Reserve Table" → Opens reservation modal
3. User selects:
   - Date (calendar picker)
   - Time (time picker)
   - Party size (number selector)
4. User confirms reservation → Reservation created
5. User receives confirmation → Reservation appears in BookingsScreen
6. User can view, modify, or cancel reservation

### 5. Profile Management Flow
1. User taps profile icon → Navigates to ProfileScreen
2. User can:
   - Edit personal information (tap edit button)
   - Toggle dark mode
   - Manage payment methods
   - View favorites
   - Change password
   - View order history
   - Logout

---

## 🎨 UI/UX Design

### Design Philosophy
- **TikTok-Inspired**: Vertical video feed, full-screen content, minimal UI
- **Kenyan-Focused**: Colors and design elements inspired by Kenyan culture
- **Dark Mode First**: Optimized for both light and dark themes
- **Mobile-First**: Designed primarily for mobile devices

### Color Scheme

#### Light Mode
- Primary: `#E23744` (Red - Kenyan flag inspired)
- Secondary: `#FFB800` (Yellow/Gold)
- Background: `#F8F8F8` (Light gray)
- Text: `#2C2C2C` (Dark gray)
- Card Background: `#FFFFFF` (White)

#### Dark Mode
- Primary: `#FF6B7A` (Lighter red)
- Secondary: `#FFD54F` (Lighter gold)
- Background: `#121212` (Dark)
- Text: `#FFFFFF` (White)
- Card Background: `#1E1E1E` (Dark gray)

### Typography
- Headers: Bold, 18-22px
- Body: Regular, 14-16px
- Small text: 12px
- Numbers: Bold, 12px (for likes/comments)

### Component Patterns
- **Buttons**: Rounded corners, theme-aware colors
- **Cards**: Elevated with shadow, rounded corners
- **Inputs**: Rounded borders, theme-aware backgrounds
- **Video Overlay**: Semi-transparent backgrounds for readability

---

## 🔐 Security Features

### Authentication Security
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Refresh token rotation
- ✅ Secure token storage in AsyncStorage
- ✅ Automatic token refresh on API calls

### API Security
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Rate limiting on API endpoints
- ✅ Input validation with express-validator
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ XSS protection

### Data Security
- ✅ Environment variables for sensitive data
- ✅ No sensitive data in client-side code
- ✅ Secure password storage (never plain text)

---

## 📊 Current Status

### ✅ Completed Features

#### Backend (100% Complete)
- ✅ Express.js server setup
- ✅ PostgreSQL database with Sequelize
- ✅ User authentication (register, login, JWT)
- ✅ Restaurant CRUD operations
- ✅ Video CRUD operations
- ✅ Menu item operations
- ✅ Review system
- ✅ Reservation system
- ✅ Database seeding scripts
- ✅ API documentation

#### Frontend (90% Complete)
- ✅ User authentication (login, signup)
- ✅ Restaurant discovery (browse, search, nearby)
- ✅ Restaurant detail pages
- ✅ Shopping cart functionality
- ✅ Checkout process
- ✅ Order confirmation
- ✅ User profile management
- ✅ Dark/light theme system
- ✅ TikTok-style video feed
- ✅ Video interactions (like, comment, share)
- ✅ Inactivity timeout
- ✅ Responsive design (tablet & phone)

### 🚧 In Progress (Pivot Phase)
- 🚧 Events system (backend models and API)
- 🚧 Deals system (daily specials, happy hours)
- 🚧 EventsScreen frontend
- 🚧 EventDetailScreen
- 🚧 HomeScreen redesign (events-first)
- 🚧 Vibe-based browsing
- 🚧 Open Now indicators
- 🚧 WhatsApp deep linking
- 🚧 Map view with events

### 📋 Planned Features (3-Week Launch)

#### Week 1: Backend
- [ ] Event model and API endpoints
- [ ] EventAttendee model and tracking
- [ ] Deal model and API endpoints
- [ ] Enhanced restaurant endpoints (include events)
- [ ] Database seeding (20 restaurants, 30-40 events)

#### Week 2: Frontend
- [ ] Redesign HomeScreen (events-first)
- [ ] Build EventsScreen with filters
- [ ] Build EventDetailScreen
- [ ] Update RestaurantScreen (add events section)
- [ ] Implement "Going" / "Interested" functionality
- [ ] Add WhatsApp sharing
- [ ] Build map view
- [ ] Add vibe-based browsing

#### Week 3: Polish & Launch
- [ ] Add "Open Now" indicators
- [ ] Event countdown timers
- [ ] Push notifications setup
- [ ] Beta testing
- [ ] Restaurant onboarding
- [ ] Launch preparation

#### Phase 2 (Months 4-6)
- [ ] Trending sounds & hashtags
- [ ] Duet & Stitch features
- [ ] Voice search in Swahili
- [ ] Advanced filters
- [ ] User profiles with food preferences
- [ ] Direct messaging
- [ ] Matatu route food maps
- [ ] County food passports

#### Phase 3 (Months 7-9)
- [ ] Live streaming
- [ ] Challenges & hashtag campaigns
- [ ] Featured creator program
- [ ] Verified badges
- [ ] Restaurant analytics dashboard
- [ ] Creator earnings dashboard

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL (or Docker for PostgreSQL)
- Expo CLI installed globally
- Expo Go app on mobile device (for testing)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start PostgreSQL (if using Docker)
docker start getcravy-postgres

# Run database migrations
npm run migrate

# Seed database
npm run seed
npm run seed:users
npm run seed:videos

# Start development server
npm run dev
```

### Database Setup
The project uses PostgreSQL running in Docker:
- Container name: `getcravy-postgres`
- Port: `5433` (host) → `5432` (container)
- Database: `getcravy_db`
- User: `postgres`
- Password: Set in `backend/.env`

---

## 📈 Performance Considerations

### Frontend Optimization
- ✅ Lazy loading for images
- ✅ Video auto-play/pause on scroll
- ✅ Efficient FlatList rendering
- ✅ Memoized components where needed
- ✅ Optimized re-renders with React Context

### Backend Optimization
- ✅ Database indexing on frequently queried fields
- ✅ Pagination for large datasets
- ✅ Efficient Sequelize queries
- ✅ Rate limiting to prevent abuse
- ✅ CORS configured for production

### Video Optimization
- ✅ Video compression (planned)
- ✅ Thumbnail generation (planned)
- ✅ Progressive loading (planned)
- ✅ Data saver mode (planned)

---

## 🧪 Testing Strategy

### Current Testing
- Manual testing on iOS/Android devices
- Expo Go for quick iteration
- Backend API testing with Postman/curl

### Planned Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Detox)
- [ ] API tests (Supertest)
- [ ] Performance testing
- [ ] Security testing

---

## 📱 Platform Support

### Currently Supported
- ✅ iOS (via Expo)
- ✅ Android (via Expo)
- ✅ Development builds

### Planned
- [ ] Web version (PWA)
- [ ] Tablet optimization
- [ ] Apple Watch companion app (future)

---

## 🌍 Localization

### Current Languages
- English (default)

### Planned
- [ ] Swahili translation
- [ ] Sheng slang support
- [ ] Multi-language interface

---

## 💰 Monetization Strategy

### Phase 1 (Free)
- Free for all users
- Focus on user acquisition
- No revenue generation

### Phase 2 (Revenue Generation)
- **Restaurant Subscriptions**: 5K-15K KES/month
  - Verified badge
  - Featured placement
  - Analytics dashboard
- **Creator Tips**: 20% commission
  - Users tip creators 5-50 KES
  - Platform takes 20% cut
- **Promoted Videos**: 100 KES per 1,000 views

### Phase 3 (Scale)
- Advanced filters for creators: 500 KES one-time
- Restaurant promoted videos
- Corporate partnerships
- Delivery integration (commission-based)

---

## 🔮 Future Vision

### Short Term (3-6 months)
- Launch MVP with events and restaurant discovery
- Onboard 20+ restaurants in first month
- Reach 1,000+ active users
- Prove demand for events platform
- Gather user feedback and iterate

### Medium Term (6-12 months)
- Scale to 5,000+ users
- Onboard 50+ restaurants
- Start soft monetization (Premium/Pro tiers)
- Expand to Mombasa and Kisumu
- Add advanced analytics for restaurants

### Long Term (12+ months)
- Become the #1 restaurant discovery app in Kenya
- 10,000+ active users
- 100+ restaurants
- Consider adding video features (Stories, event recaps)
- Expand to other African countries
- Build restaurant marketing platform

---

## 📞 Support & Contact

### Development
- **Repository**: GitHub (private/public)
- **Issue Tracking**: GitHub Issues
- **Documentation**: See project docs folder

### Business
- **Email**: support@goeat.com (planned)
- **Website**: www.goeat.com (planned)

---

## 📄 License

This project is licensed under the 0BSD License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community
- TikTok for UI/UX inspiration
- Kenyan food culture and community

---

## 📝 Version History

### Version 1.0.0 (Current)
- ✅ Core authentication system
- ✅ Restaurant discovery
- ✅ TikTok-style video feed
- ✅ Shopping cart & checkout
- ✅ User profile management
- ✅ Dark/light theme
- ✅ Inactivity timeout

### Upcoming Versions
- **v1.1.0**: Video upload & creation
- **v1.2.0**: M-Pesa integration
- **v1.3.0**: WhatsApp sharing
- **v2.0.0**: Creator features & monetization

---

**Last Updated**: December 2024  
**Status**: 🟡 In Active Development  
**Next Milestone**: Video Upload & Creation Features

