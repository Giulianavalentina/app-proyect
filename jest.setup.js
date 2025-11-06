import "@testing-library/jest-native/extend-expect";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Silenciar las alertas
const originalError = console.error;
jest.spyOn(console, "error").mockImplementation((message, ...args) => {
  if (typeof message === "string" && message.includes("not wrapped in act")) {
    return;
  }
  originalError(message, ...args);
});
