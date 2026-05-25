# 🍔 cravyapp - Restaurant & Events Discovery Platform

**Stop scrolling Instagram for hours. Find the best restaurants and food events in Nairobi—all in one place.**

A mobile app that helps Nairobians discover restaurants and food events happening right now. Events-first discovery with vibe-based browsing, real-time information, and direct restaurant contact.

Built with React Native, Expo, Node.js, and PostgreSQL.

![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue.svg)
![Expo](https://img.shields.io/badge/Expo-53.0.7-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)
![License](https://img.shields.io/badge/License-0BSD-green.svg)

## 📱 Features

- 🎉 **Events Discovery** - Find food events happening today and this weekend
- 🏪 **Restaurant Discovery** - Browse restaurants by vibe, cuisine, and location
- 🔍 **Search & Filter** - Find restaurants and events quickly
- 📍 **Location-Based** - Discover nearby restaurants and events using GPS
- 🗺️ **Map View** - See restaurants and events on an interactive map
- 🎯 **Vibe-Based Browsing** - Browse by mood (Party, Date Night, Casual, Fine Dining, Family, Brunch)
- 📅 **Event Attendance** - Mark events as "Going" or "Interested"
- 📞 **Direct Contact** - Call and WhatsApp restaurants directly
- ⏰ **Open Now Indicator** - See which restaurants are currently open
- 💰 **Deals & Specials** - View today's deals and happy hours
- 📱 **WhatsApp Sharing** - Share events with friends
- 📅 **Calendar Integration** - Add events to your calendar
- ❤️ **Favorites** - Save your favorite restaurants
- 📋 **Bookings** - Track your reservations and events
- 🌙 **Dark Mode** - Beautiful dark theme support
- 👤 **User Profile** - Manage your account and preferences

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- For physical device testing: Expo Go app ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/getcravy.git
cd getcravy
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Then edit `.env` with your configuration:
```env
API_BASE_URL=http://localhost:5000/api
API_KEY=your_api_key_here
```

4. **Start the development server**
```bash
npm start
# or
yarn start
```

5. **Run on your device/simulator**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## 📁 Project Structure

```
getcravy/
├── assets/              # Images, icons, and other static assets
├── context/            # React Context providers (Auth, etc.)
├── endpoints/          # API endpoint configurations
├── screens/            # Screen components
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RestaurantScreen.tsx
│   ├── CartScreen.tsx
│   └── ...
├── App.tsx             # Main app component
├── index.ts            # Entry point
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE_URL=http://localhost:5000/api
API_KEY=your_api_key_here

# Environment
NODE_ENV=development

# Optional: Analytics
SENTRY_DSN=your_sentry_dsn
ANALYTICS_KEY=your_analytics_key
```

### App Configuration

Edit `app.json` to customize:
- App name and slug
- Bundle identifier
- App icons and splash screens
- Permissions

## 📱 Building for Production

### iOS

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure build**
```bash
eas build:configure
```

4. **Build for iOS**
```bash
eas build --platform ios
```

### Android

1. **Build for Android**
```bash
eas build --platform android
```

2. **Or build locally**
```bash
eas build --platform android --local
```

### App Store Deployment

1. **Submit to App Store**
```bash
eas submit --platform ios
```

2. **Submit to Google Play**
```bash
eas submit --platform android
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📦 Dependencies

### Core
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation library

### Key Libraries
- `@react-native-async-storage/async-storage` - Local storage
- `expo-location` - Location services
- `expo-linear-gradient` - Gradient components
- `react-native-gesture-handler` - Gesture handling

See `package.json` for complete list.

## 🔐 Security

- ✅ Environment variables for sensitive data
- ✅ Secure token storage (JWT with refresh tokens)
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS configured
- ✅ Helmet security headers

## 📁 Project Structure

```
getcravy/
├── backend/            # Backend API server
│   ├── src/
│   │   ├── config/     # Database config
│   │   ├── models/     # Database models
│   │   ├── controllers/# Request handlers
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Auth, validation
│   │   └── utils/      # Utilities
│   └── package.json
├── assets/             # Images, icons
├── components/         # Reusable components
│   ├── common/         # Button, Input, etc.
│   └── restaurant/     # RestaurantCard, etc.
├── constants/          # Colors, images, config
├── context/            # React Context (Auth)
├── screens/            # Screen components
├── services/           # API services
├── types/              # TypeScript types
└── App.tsx            # Main app
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the 0BSD License - see the [LICENSE](./LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community
- All contributors and testers

## 🎯 Current Status & Progress

### ✅ Completed (Week 1-3)
- ✅ Backend API server set up (Node.js/Express)
- ✅ Database configuration (PostgreSQL/Sequelize)
- ✅ Authentication API (JWT, login, signup, token refresh)
- ✅ Frontend connected to real API
- ✅ Restaurant API (CRUD, filtering, search, nearby)
- ✅ Frontend restaurant integration (replaced mock data)
- ✅ TypeScript types and components
- ✅ Component library structure
- ✅ Loading states and error handling

### 🚧 In Progress
- 🚧 Image upload system
- 🚧 Menu system
- 🚧 Review system

### 📋 Next Steps (Week 4-5)
1. Set up image storage (Cloudinary/S3)
2. Build menu API and frontend
3. Add review system
4. Implement search functionality
5. Add reservation system

## 🗺️ Development Roadmap

### Phase 1: Foundation (Weeks 1-8) - MVP
- [x] Backend setup & authentication
- [ ] Restaurant API & frontend
- [ ] Menu system
- [ ] Review system
- [ ] Search functionality
- [ ] Reservation system

### Phase 2: Social (Weeks 9-12)
- [ ] Foodie profiles
- [ ] Collections
- [ ] Social feed
- [ ] Check-ins

### Phase 3: Content (Weeks 13-16)
- [ ] Cultural discovery
- [ ] Editorial content
- [ ] Food challenges

### Phase 4: Advanced (Weeks 17+)
- [ ] AR features
- [ ] Video content
- [ ] ML recommendations
- [ ] Voice search

## 🛠️ Backend Setup

### Quick Start
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run dev
```

Server runs on `http://localhost:5000`

### API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user (protected)

See `backend/README.md` for full API documentation.

## 📱 Expo Development

### Quick Commands
```bash
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios           # Run on iOS
npm run web           # Run in browser
```

### Testing on Devices
- **Expo Go**: Scan QR code from terminal
- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal

### For Physical Device
- Install Expo Go app on your phone
- Make sure phone and computer are on same WiFi
- Scan QR code from terminal
- **Note**: For API calls, use your computer's IP address in `.env`:
```env
API_BASE_URL=http://192.168.1.X:5000/api
```

## 📚 Additional Documentation

For detailed information, see:
- **[PRODUCTION_TODO.md](./PRODUCTION_TODO.md)** - Complete production TODO list (300+ tasks)
- **[PRIORITY_ROADMAP.md](./PRIORITY_ROADMAP.md)** - Development phases and priorities
- **[STRATEGIC_VISION.md](./STRATEGIC_VISION.md)** - Project vision and strategy
- **[FEATURE_SPECIFICATIONS.md](./FEATURE_SPECIFICATIONS.md)** - Detailed feature specs
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Mobile app deployment guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend setup instructions

## 📞 Support

- 📧 Email: support@cravyapp.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/getcravy/issues)

## 📊 Project Status

**Current Version**: 1.0.0  
**Status**: 🟡 In Development - Week 1-2 Complete  
**Backend**: ✅ Running  
**Frontend**: ✅ Connected to API  
**Next**: Restaurant API & Frontend Integration

## 🐛 Known Issues

- Restaurant data still using mock data (API in progress)
- Cart persistence not fully implemented
- Some features are placeholders
- Image upload not yet implemented

---

⭐ If you like this project, please give it a star on GitHub!

