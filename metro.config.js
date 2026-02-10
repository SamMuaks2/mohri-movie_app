const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-web-webview': require.resolve('react-native-webview'),
};

module.exports = withNativeWind(config, { input: './app/globals.css' });