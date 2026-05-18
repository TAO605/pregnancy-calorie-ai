module.exports = {
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.cjs",
    "<rootDir>/tests/integration/**/*.test.cjs"
  ],
  collectCoverageFrom: [
    "scripts/**/*.mjs",
    "public/locales/**/*.json",
    "!public/locales/deepl-api-call-log.json"
  ],
  reporters: ["default"]
};
