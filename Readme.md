# ZKNSight Mobile App

ZKNSight is a cutting-edge decentralized finance (DeFi) application designed to provide users with a seamless and secure experience in managing and trading their digital assets on the Sui network. This app leverages zkLogin's privacy-preserving authentication technology to ensure user data is protected while offering a comprehensive suite of DeFi functionalities.

## Prerequisites

Before you start, ensure you have the following software installed:

- **Node.js**: v20.13.1
- **Java**: 17
- **Expo CLI**: 6.3.10

## Setup

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/your-repo/zknsight.git
   cd zknsight
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Configure Environment Variables**:
   Fill in the credentials in `constants.js` with the appropriate values:

   ```javascript
   export const ANDROID_CLIENT_ID = 'your-android-client-id';
   export const USER_SALT_LOCAL_STORAGE_KEY = 'your-user-salt-local-storage-key';
   export const TOKEN_API_KEY = 'your-token-api-key';
   export const KRIYA_POOLS_TOKEN = 'your-kriya-pools-token';
   export const ZETTABLOCK_X_API_KEY = 'your-zettablock-x-api-key';
   ```

4. **Prebuild (if needed)**:
   If you need to prebuild the app, run:
   ```sh
   npx expo prebuild
   ```

5. **Run the Application**:
   To run the application on an Android device or emulator, use:
   ```sh
   npm run android
   ```

## Additional Setup for Android

The app for Android requires additional setup in the Google API Console. Ensure you configure the Google API Console with the necessary settings for your app to function correctly.

## Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Google API Console](https://console.developers.google.com/)

## Support

If you encounter any issues or have any questions, please open an issue in the repository or contact the project maintainers.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
