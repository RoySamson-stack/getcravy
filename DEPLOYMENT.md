# Deployment Guide

This guide covers deploying GoEat to iOS App Store and Google Play Store.

## Prerequisites

1. **Expo Account**: Sign up at [expo.dev](https://expo.dev)
2. **EAS CLI**: Install globally
   ```bash
   npm install -g eas-cli
   ```
3. **Apple Developer Account** (for iOS): $99/year
4. **Google Play Developer Account** (for Android): $25 one-time

## Initial Setup

### 1. Login to Expo

```bash
eas login
```

### 2. Configure EAS

```bash
eas build:configure
```

This creates/updates `eas.json` configuration file.

### 3. Link Project

```bash
eas project:init
```

## iOS Deployment

### 1. Apple Developer Setup

1. Create an Apple Developer account at [developer.apple.com](https://developer.apple.com)
2. Create an App ID in App Store Connect
3. Generate certificates (EAS can do this automatically)

### 2. Configure iOS in app.json

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.goeat.app",
      "buildNumber": "1"
    }
  }
}
```

### 3. Build for iOS

**Development Build:**
```bash
eas build --platform ios --profile development
```

**Production Build:**
```bash
eas build --platform ios --profile production
```

### 4. Submit to App Store

```bash
eas submit --platform ios
```

You'll need:
- Apple ID credentials
- App Store Connect API key (recommended)

## Android Deployment

### 1. Google Play Setup

1. Create a Google Play Developer account
2. Create a new app in Google Play Console
3. Set up app signing (Google can manage this)

### 2. Configure Android in app.json

```json
{
  "expo": {
    "android": {
      "package": "com.goeat.app",
      "versionCode": 1
    }
  }
}
```

### 3. Build for Android

**APK (for testing):**
```bash
eas build --platform android --profile preview
```

**AAB (for Play Store):**
```bash
eas build --platform android --profile production
```

### 4. Submit to Google Play

```bash
eas submit --platform android
```

You'll need:
- Google Play service account JSON key
- Or manual upload through Play Console

## Environment-Specific Builds

### Development

```bash
eas build --profile development
```

### Staging/Preview

```bash
eas build --profile preview
```

### Production

```bash
eas build --profile production
```

## Updating Your App

### 1. Update Version

**iOS:**
- Update `buildNumber` in `app.json` → `ios.buildNumber`

**Android:**
- Update `versionCode` in `app.json` → `android.versionCode`

**Both:**
- Update `version` in `app.json` → `expo.version`

### 2. Build and Submit

```bash
# Build
eas build --platform all --profile production

# Submit
eas submit --platform all
```

## OTA Updates (Over-The-Air)

Update your app without going through app stores:

### 1. Publish Update

```bash
eas update --branch production --message "Bug fixes and improvements"
```

### 2. Configure Update Channels

In `eas.json`:
```json
{
  "update": {
    "channel": "production"
  }
}
```

## Continuous Deployment

### GitHub Actions

See `.github/workflows/release.yml` for automated builds on tags.

### Manual Workflow

1. Update version numbers
2. Commit and tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
3. GitHub Actions will build automatically

## App Store Assets

### iOS App Store

Required:
- App icon (1024x1024)
- Screenshots (various sizes)
- App description
- Privacy policy URL
- Support URL

### Google Play Store

Required:
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (at least 2)
- App description
- Privacy policy URL

## Troubleshooting

### Build Fails

1. Check EAS build logs:
   ```bash
   eas build:list
   eas build:view [build-id]
   ```

2. Common issues:
   - Missing environment variables
   - Invalid bundle identifier
   - Certificate issues
   - Code signing problems

### Submission Fails

1. Verify app metadata in stores
2. Check compliance requirements
3. Ensure all required assets are uploaded
4. Review store guidelines

## Security Checklist

Before deploying:

- [ ] Remove debug code
- [ ] Remove console.logs
- [ ] Use production API endpoints
- [ ] Enable code obfuscation (if needed)
- [ ] Review permissions
- [ ] Test on real devices
- [ ] Security audit completed

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

## Support

For deployment issues:
- Check [Expo Forums](https://forums.expo.dev/)
- Review [EAS Documentation](https://docs.expo.dev/)
- Open an issue on GitHub








