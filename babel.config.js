module.exports = {
  presets: [
    ['module:@react-native/babel-preset', { jsxImportSource: 'nativewind' }],
    'nativewind/babel',
  ],
  // Keep Reanimated plugin last if you use it
  plugins: ['react-native-reanimated/plugin'],
};
