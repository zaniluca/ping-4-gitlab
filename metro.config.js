// https://github.com/expo/fyi/blob/main/sentry-expo-migration.md#update-your-metroconfigjs-to-include-the-sentry-transformer-plugin
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// eslint-disable-next-line no-undef
const config = getSentryExpoConfig(__dirname);

module.exports = config;
