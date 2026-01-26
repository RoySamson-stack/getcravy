# 📱 Expo Development Guide for GoEat

## Quick Start with Expo

### Prerequisites
```bash
# Check Node.js version (need 18+)
node --version

# Install Expo CLI globally
npm install -g expo-cli

# Or use npx (no global install needed)
npx expo --version
```

### Initial Setup
```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your API URLs

# 3. Start Expo dev server
npm start
```

### Running on Devices

#### Option 1: Expo Go App (Easiest)
1. Install **Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Scan QR code from terminal
3. App loads on your phone!

#### Option 2: iOS Simulator (Mac only)
```bash
# Press 'i' in Expo terminal
# Or run directly:
npm run ios
```

#### Option 3: Android Emulator
```bash
# Press 'a' in Expo terminal
# Or run directly:
npm run android
# (Requires Android Studio setup)
```

---

## 🛠️ Expo-Specific Features We'll Use

### 1. Image Handling
```typescript
// Use expo-image for better performance
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={styles.image}
  contentFit="cover"
  transition={200}
/>
```

### 2. Location Services
```typescript
// Already installed: expo-location
import * as Location from 'expo-location';

// Request permissions
const { status } = await Location.requestForegroundPermissionsAsync();

// Get current location
const location = await Location.getCurrentPositionAsync({});
```

### 3. Camera & Photos
```typescript
// Install: expo-image-picker
import * as ImagePicker from 'expo-image-picker';

// Pick image
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.8,
});
```

### 4. Push Notifications
```typescript
// Install: expo-notifications
import * as Notifications from 'expo-notifications';

// Register for push notifications
const token = await Notifications.getExpoPushTokenAsync();
```

### 5. File System
```typescript
// Install: expo-file-system
import * as FileSystem from 'expo-file-system';

// Download file
const { uri } = await FileSystem.downloadAsync(
  'https://example.com/file.jpg',
  FileSystem.documentDirectory + 'file.jpg'
);
```

---

## 📁 Project Structure for Expo

```
getcravy/
├── assets/                 # Images, fonts, etc.
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/             # Reusable components
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── restaurant/
│   │   ├── RestaurantCard.tsx
│   │   ├── MenuItem.tsx
│   │   └── ReviewCard.tsx
│   └── social/
│       ├── FoodieProfile.tsx
│       └── CollectionCard.tsx
├── screens/                # Screen components
│   ├── HomeScreen.tsx
│   ├── RestaurantScreen.tsx
│   └── ...
├── navigation/             # Navigation setup
│   ├── AppNavigator.tsx
│   └── types.ts
├── services/               # API services
│   ├── api.ts
│   ├── restaurants.ts
│   └── auth.ts
├── hooks/                  # Custom hooks
│   ├── useLocation.ts
│   └── useRestaurants.ts
├── context/                # Context providers
│   └── AuthContext.tsx
├── utils/                   # Utility functions
│   ├── format.ts
│   └── validation.ts
├── types/                   # TypeScript types
│   ├── restaurant.ts
│   └── user.ts
├── constants/               # Constants
│   ├── colors.ts
│   └── config.ts
├── App.tsx                  # Root component
├── app.json                 # Expo config
└── package.json
```

---

## 🔧 Expo Configuration (app.json)

### Current Setup
```json
{
  "expo": {
    "name": "GoEat",
    "slug": "goeat",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#E23744"
    },
    "ios": {
      "bundleIdentifier": "com.goeat.app",
      "supportsTablet": true
    },
    "android": {
      "package": "com.goeat.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png"
      }
    }
  }
}
```

### Adding Plugins
```json
{
  "expo": {
    "plugins": [
      "expo-location",
      "expo-image-picker",
      "expo-notifications",
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow GoEat to access your photos for reviews."
        }
      ]
    ]
  }
}
```

---

## 📦 Installing Expo Packages

### Common Packages We'll Need

```bash
# Image handling
npx expo install expo-image

# Camera & Photos
npx expo install expo-image-picker

# Notifications
npx expo install expo-notifications

# File system
npx expo install expo-file-system

# Sharing
npx expo install expo-sharing

# Secure storage
npx expo install expo-secure-store

# Web browser
npx expo install expo-web-browser

# Linking
npx expo install expo-linking

# Keep awake (for videos)
npx expo install expo-keep-awake
```

### Why `npx expo install`?
- Ensures compatible versions with your Expo SDK
- Automatically updates `app.json` if needed
- Better than `npm install` for Expo packages

---

## 🚀 Development Workflow

### Daily Development
```bash
# 1. Start dev server
npm start

# 2. Choose platform:
#    - Press 'i' for iOS
#    - Press 'a' for Android
#    - Scan QR for Expo Go

# 3. Make changes
#    - Save file
#    - App auto-reloads (Fast Refresh)

# 4. Debug
#    - Shake device or Cmd+D (iOS) / Cmd+M (Android)
#    - Open developer menu
```

### Fast Refresh
- Automatically reloads when you save
- Preserves component state
- Works for most changes
- Sometimes need full reload (Cmd+R)

### Debugging
```bash
# Open React Native Debugger
# Or use Chrome DevTools
# Shake device → "Debug Remote JS"
```

---

## 🏗️ Building for Testing

### Development Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build development version
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Preview Build (Internal Testing)
```bash
# Build preview version
eas build --profile preview --platform android
# Creates APK for Android

eas build --profile preview --platform ios
# Creates IPA for iOS (TestFlight)
```

### Production Build
```bash
# Build for stores
eas build --profile production --platform all
```

---

## 📱 Testing on Physical Devices

### iOS (iPhone/iPad)
1. **Development**: Use Expo Go app
2. **Testing**: Build with EAS, install via TestFlight
3. **Production**: Submit to App Store

### Android
1. **Development**: Use Expo Go app
2. **Testing**: Build APK, install directly
3. **Production**: Submit to Google Play

### Testing Checklist
- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Test with poor network
- [ ] Test offline functionality
- [ ] Test camera features
- [ ] Test location services
- [ ] Test push notifications
- [ ] Test on different screen sizes

---

## 🔄 Updating the App

### Over-the-Air (OTA) Updates
```bash
# Publish update (no app store needed)
eas update --branch production --message "Bug fixes"

# Users get update automatically
# (Requires EAS Update setup)
```

### When OTA Updates Work
- ✅ JavaScript changes
- ✅ Asset updates (images, fonts)
- ✅ Configuration changes
- ❌ Native code changes (need new build)
- ❌ New permissions (need new build)
- ❌ New Expo SDK (need new build)

---

## 🐛 Common Expo Issues & Solutions

### Issue: Metro bundler cache
```bash
# Clear cache and restart
npx expo start -c
```

### Issue: Port already in use
```bash
# Kill process on port 8081
npx kill-port 8081
npm start
```

### Issue: Can't connect to Expo Go
- Check phone and computer on same WiFi
- Try tunnel mode: `npx expo start --tunnel`
- Check firewall settings

### Issue: App crashes on load
- Check console for errors
- Clear Expo Go app cache
- Restart dev server
- Check `app.json` for errors

### Issue: Images not loading
- Check image URLs are HTTPS
- Verify CORS settings
- Check network permissions
- Use `expo-image` instead of `Image`

---

## 📊 Performance Tips

### Image Optimization
```typescript
// Use expo-image (faster than Image)
import { Image } from 'expo-image';

// Lazy load images
<Image
  source={{ uri }}
  placeholder={{ blurhash }}
  contentFit="cover"
  cachePolicy="memory-disk"
/>
```

### List Performance
```typescript
// Use FlatList for long lists
<FlatList
  data={restaurants}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

### Bundle Size
- Use `expo-optimize` to analyze bundle
- Remove unused dependencies
- Use tree-shaking
- Code split where possible

---

## 🔐 Environment Variables

### Setup
```bash
# Install
npm install react-native-config
# Or use expo-constants for Expo

# Create .env
API_BASE_URL=https://api.goeat.com
API_KEY=your_key_here
```

### Usage
```typescript
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
```

### Security
- Never commit `.env` file
- Use different `.env` for dev/staging/prod
- Don't put secrets in code

---

## 📝 Best Practices

### 1. Use Expo SDK Packages
- Always use `expo install` for Expo packages
- Check compatibility with SDK version
- Update regularly

### 2. Test on Real Devices
- Expo Go is great for development
- Test on real devices before release
- Test on both iOS and Android

### 3. Handle Permissions
- Request permissions properly
- Handle denial gracefully
- Explain why permissions needed

### 4. Optimize Images
- Compress images before upload
- Use appropriate sizes
- Lazy load images
- Use WebP format

### 5. Error Handling
- Handle network errors
- Show user-friendly messages
- Log errors for debugging
- Use error boundaries

---

## 🎯 Next Steps

1. ✅ Set up Expo development environment
2. ⏭️ Install required Expo packages
3. ⏭️ Set up navigation
4. ⏭️ Create component library
5. ⏭️ Build first screens
6. ⏭️ Test on Expo Go

---

**Remember**: Expo Go is perfect for development, but you'll need EAS Build for production features like push notifications, camera, etc.

**Resources**:
- [Expo Docs](https://docs.expo.dev/)
- [Expo SDK Reference](https://docs.expo.dev/versions/latest/)
- [Expo Forums](https://forums.expo.dev/)








