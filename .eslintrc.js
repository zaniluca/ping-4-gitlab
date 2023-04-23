module.exports = {
  plugins: ["@tanstack/query"],
  extends: [
    "universe/native",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    // "universe/shared/typescript-analysis"
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
