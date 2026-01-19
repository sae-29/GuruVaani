# Mobile App Setup Guide

## Current Status

✅ **Metro Bundler**: Running (or ready to start)
❌ **Android Project**: Not initialized - needs setup

## Quick Start Options

### Option 1: Initialize Android Project (Recommended for Production)

The mobile app needs the native Android project folder. Here's how to set it up:

1. **Prerequisites:**
   - Android Studio installed
   - Android SDK (API 21+)
   - Java JDK 11 or higher

2. **Initialize Android Project:**
   ```bash
   cd mobile-app
   
   # Create a temporary React Native project to copy Android folder
   npx react-native init TempProject --skip-install
   
   # Copy the android folder to mobile-app
   Copy-Item -Path "TempProject\android" -Destination "." -Recurse
   
   # Clean up
   Remove-Item -Path "TempProject" -Recurse -Force
   ```

3. **Configure the project:**
   - Update `android/app/build.gradle` with your app name from `app.json`
   - Update `android/app/src/main/AndroidManifest.xml` with permissions
   - Update package name in `android/app/src/main/java/.../MainActivity.java`

4. **Run the app:**
   ```bash
   # Start Metro bundler (in one terminal)
   npm start
   
   # Run on Android (in another terminal)
   npm run android
   ```

### Option 2: Use Expo (Easier for Development)

Convert to Expo for easier development:

1. **Install Expo CLI:**
   ```bash
   npm install -g expo-cli
   ```

2. **Initialize Expo:**
   ```bash
   cd mobile-app
   npx expo init --template blank-typescript
   ```

3. **Run with Expo:**
   ```bash
   npx expo start
   ```

4. **Connect via:**
   - Expo Go app on your phone (scan QR code)
   - Android emulator (press 'a')
   - iOS simulator (press 'i')

### Option 3: Use React Native CLI (Current Setup)

If you have Android Studio set up:

1. **Start Metro Bundler:**
   ```bash
   cd mobile-app
   npm start
   ```

2. **In another terminal, run Android:**
   ```bash
   cd mobile-app
   npm run android
   ```

   **Note:** This requires the `android` folder to exist.

## Current Metro Bundler Status

The Metro bundler should be running on **port 8081**.

To check:
```bash
netstat -ano | findstr ":8081"
```

To start manually:
```bash
cd mobile-app
npm start
```

## Troubleshooting

### "Android project not found"
- The `android` folder is missing
- Follow Option 1 above to initialize it

### "SDK location not found"
- Set `ANDROID_HOME` environment variable
- Point to your Android SDK location (usually `C:\Users\YourName\AppData\Local\Android\Sdk`)

### "Java not found"
- Install JDK 11 or higher
- Set `JAVA_HOME` environment variable

### Metro bundler not starting
- Clear cache: `npm start -- --reset-cache`
- Delete `node_modules` and reinstall: `npm install`

## Development URLs

- **Metro Bundler**: http://localhost:8081
- **Backend API**: http://localhost:3001
- **Web Dashboard**: http://localhost:3000

## Features Available

Once running, the mobile app includes:
- ✅ Complete onboarding flow (5 screens)
- ✅ Home dashboard with stats
- ✅ Create diary entries (text/voice)
- ✅ Training library
- ✅ Community wall
- ✅ Progress tracking
- ✅ Settings

## Next Steps

1. Choose one of the setup options above
2. Initialize the Android project or use Expo
3. Connect your device/emulator
4. Start developing!

For questions or issues, check the React Native documentation or Expo documentation.
