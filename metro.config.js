// https://github.com/expo/fyi/blob/main/sentry-expo-migration.md#update-your-metroconfigjs-to-include-the-sentry-transformer-plugin
const { getDefaultConfig } = require("expo/metro-config");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// eslint-disable-next-line no-undef
const defaultConfig = getDefaultConfig(__dirname);
const config = getSentryExpoConfig(__dirname, defaultConfig);

module.exports = config;
