module.exports = {
  clearMocks: true,
  silent: true,
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/prisma/mocked-client.ts"],
  testPathIgnorePatterns: ["dist/", "node_modules/"],
  testTimeout: 10000,
};
