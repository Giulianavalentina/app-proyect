module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native" +
      "|@react-native" +
      "|@react-navigation" +
      "|expo" +
      "|expo-.*" +
      "|@expo/.*" +
      "|react-clone-referenced-element" +
      "|react-native-svg" +
      "|@unimodules/.*" +
      "|unimodules-.*" +
      "|sentry-expo" +
      ")",
  ],
};
