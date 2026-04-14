module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
    '^react-native-image-picker$':
      '<rootDir>/__mocks__/react-native-image-picker.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-css-interop|nativewind)/)',
  ],
};
