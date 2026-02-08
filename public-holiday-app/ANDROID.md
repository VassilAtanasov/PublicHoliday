# Android Native App Setup

This document describes how to build and run the Public Holiday app as a native Android application using Capacitor.

## Prerequisites

Before building the Android app, ensure you have:

1. **Node.js** (v20.19.0 or >=22.12.0)
2. **Android Studio** (latest version recommended)
3. **Android SDK** (API level 22 or higher)
4. **Java Development Kit (JDK)** (version 17 recommended)

## Project Structure

```
public-holiday-app/
├── android/                    # Native Android project
│   ├── app/                   # Android app module
│   ├── build.gradle           # Project build configuration
│   └── ...
├── src/                       # Vue.js source code
├── dist/                      # Built web assets (synced to Android)
├── capacitor.config.ts        # Capacitor configuration
└── package.json
```

## Installation

The Android platform has already been set up with Capacitor. If you need to reinstall dependencies:

```bash
npm install
```

## Building for Android

### 1. Build the Web App

First, build the Vue.js web application:

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

### 2. Sync Web Assets to Android

Sync the built web assets to the Android project:

```bash
npm run android:sync
```

Or use the combined command that builds and syncs in one step:

```bash
npm run android:build
```

### 3. Open in Android Studio

Open the Android project in Android Studio:

```bash
npm run android:open
```

Or manually open the `android/` folder in Android Studio.

### 4. Run on Device or Emulator

#### Option A: From Android Studio
1. Click the "Run" button (green play icon)
2. Select your target device (physical device or emulator)
3. Wait for the app to build and install

#### Option B: From Command Line
```bash
npm run android:run
```

This will build and run the app on a connected device or running emulator.

## Development Workflow

When making changes to the Vue.js app:

1. Make your changes in `src/`
2. Build the web app: `npm run build`
3. Sync to Android: `npm run android:sync`
4. Rebuild and run from Android Studio

For faster development, you can use live reload:

```bash
npm run dev
```

Then update the `capacitor.config.ts` to point to your dev server temporarily.

## App Configuration

### App Details
- **App Name**: Public Holiday
- **Package ID**: com.publicholiday.app
- **Version**: 1.0 (versionCode: 1)

### Permissions
The app requires the following permissions:
- `INTERNET` - Required for fetching holiday data from the API

### Minimum Requirements
- **Min SDK**: API 22 (Android 5.1)
- **Target SDK**: API 34 (Android 14)
- **Compile SDK**: API 34

## Building a Release APK

To create a signed release build:

1. Open Android Studio
2. Go to **Build → Generate Signed Bundle / APK**
3. Select **APK**
4. Create or select a keystore
5. Fill in the key details
6. Select **release** build variant
7. Click **Finish**

The APK will be generated in `android/app/release/`.

## Troubleshooting

### Gradle Build Fails
- Ensure you have the correct Android SDK installed
- Check that `ANDROID_HOME` environment variable is set
- Try cleaning the project: `cd android && ./gradlew clean`

### App Crashes on Launch
- Check the logcat in Android Studio for error messages
- Ensure all web assets are synced: `npm run android:sync`
- Verify the API endpoint is accessible from the device

### White Screen or Blank App
- Rebuild the web app: `npm run build`
- Sync to Android: `npm run android:sync`
- Check the web view console in Android Studio

## Useful Commands

```bash
# Build web app
npm run build

# Sync web assets to Android
npm run android:sync

# Build and sync in one command
npm run android:build

# Open Android project in Android Studio
npm run android:open

# Run on device/emulator
npm run android:run

# Clean Android build
cd android && ./gradlew clean
```

## Additional Resources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android Developer Guide](https://developer.android.com/guide)
- [Vue.js Documentation](https://vuejs.org/)

## Support

For issues specific to:
- **Capacitor**: Visit [Capacitor GitHub](https://github.com/ionic-team/capacitor)
- **Vue.js**: Visit [Vue.js Forum](https://forum.vuejs.org/)
- **Android**: Visit [Stack Overflow](https://stackoverflow.com/questions/tagged/android)
