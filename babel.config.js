module.exports = {
  presets: [
    ['module:@react-native/babel-preset', { jsxImportSource: 'nativewind' }],
    'nativewind/babel',
  ],
  plugins: [
    ['module:react-native-dotenv', {
      envName: 'APP_ENV',        // process.env.APP_ENV selects the file
      moduleName: '@env',
      path: '.env',
      blocklist: null,
      allowlist: ['SUPABASE_URL', 'SUPABASE_ANON_KEY'],  // whitelist only what you need
      safe: true,                // throws if a key is missing
      allowUndefined: false,
    }],
    'react-native-reanimated/plugin',
  ],
};
