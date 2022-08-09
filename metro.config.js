const { getDefaultConfig } = require("expo/metro-config");
// eslint-disable-next-line no-undef
const defaultConfig = getDefaultConfig(__dirname);
// Adding cjs to support cjs modules (firebase only)
defaultConfig.resolver.sourceExts.push("cjs");

module.exports = defaultConfig;
