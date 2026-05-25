# cravyapp Website

Professional website for cravyapp app with APK download functionality.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Place your APK file:
```bash
# Copy your built APK to the downloads folder
cp /path/to/your/cravyapp.apk ./downloads/cravyapp.apk
```

3. Start the server:
```bash
npm start
```

The website will be available at http://localhost:3000

## Building APK

To build your APK for download:

```bash
# From the main project directory
cd /home/unknwn/getcravy
eas build --platform android --local

# Copy the built APK to website
cp ./build/cravyapp.apk ./website/downloads/cravyapp.apk
```

## Features

- Professional landing page
- APK download functionality
- Responsive design
- Feature showcase
- Contact information
