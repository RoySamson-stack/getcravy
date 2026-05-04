module.exports = {
  expo: {
    name: "GoEat",
    slug: "goeat",
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#E23744"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.goeat.app",
      buildNumber: "2",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "This app needs to access your location to show nearby restaurants",
        NSLocationAlwaysAndWhenInUseUsageDescription: "This app needs to access your location to show nearby restaurants"
      }
    },
    android: {
      package: "com.goeat.app",
      versionCode: 3,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "INTERNET"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "87189bdd-903f-44e4-a305-7630b40d521e"
      }
    },
    privacy: "public",
    plugins: [
      "expo-location"
    ],
    owner: "riot428"
  }
};
