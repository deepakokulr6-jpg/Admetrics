module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '^react-native-linear-gradient$':
      '<rootDir>/__mocks__/linearGradientMock.js',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/asyncStorageMock.js',
    '^react-native-keychain$': '<rootDir>/__mocks__/keychainMock.js',
    '^react-native-image-picker$': '<rootDir>/__mocks__/imagePickerMock.js',
    '^@swmansion/react-native-bottom-sheet$':
      '<rootDir>/__mocks__/bottomSheetMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-vector-icons|@reduxjs|react-redux|redux|redux-persist|immer|reselect)/)',
  ],
};
