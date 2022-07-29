module.exports = {
  extends: [
    "universe/native",
    // "universe/shared/typescript-analysis"
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "no-unused-vars": "warn",
  },
  settings: {
    "import/ignore": ["react-native"],
  },
  // overrides: [
  //   {
  //     files: ["*.ts", "*.tsx", "*.d.ts"],
  //     parserOptions: {
  //       project: "./tsconfig.json",
  //     },
  //   },
  // ],
};
