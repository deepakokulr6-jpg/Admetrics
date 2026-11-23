module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // .env → `import { API_BASE_URL } from '@env'` (see src/config/env.ts).
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
