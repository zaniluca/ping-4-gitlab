module.exports = {
  extends: "universe/native",
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
  settings: {
    "import/ignore": ["react-native"],
  },
};
