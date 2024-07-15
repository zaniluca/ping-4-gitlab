module.exports = {
  plugins: ["@tanstack/query"],
  extends: [
    "universe/native",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
    // Removed since we don't want to upgrade to the new API yet
    "@tanstack/query/no-deprecated-options": "off",
  },
  settings: {
    "import/ignore": ["react-native"],
  },
};
