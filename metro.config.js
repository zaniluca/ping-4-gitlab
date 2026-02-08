// https://github.com/expo/fyi/blob/main/sentry-expo-migration.md#update-your-metroconfigjs-to-include-the-sentry-transformer-plugin
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig } = require("expo/metro-config");

// eslint-disable-next-line no-undef
const defaultConfig = getDefaultConfig(__dirname);
// eslint-disable-next-line no-undef
const config = getSentryExpoConfig(__dirname, defaultConfig);

module.exports = config;
