export default {
  getItem: jest.fn(async (key) => {
    if (key === "alarms") {
      return JSON.stringify([
        {
          id: "1",
          medication: "Paracetamol",
          dosage: 500,
          time: "08:00",
          isActive: true,
        },
        {
          id: "2",
          medication: "Ibuprofeno",
          dosage: 400,
          time: "20:00",
          isActive: true,
        },
      ]);
    }
    return null;
  }),
  setItem: jest.fn(async () => null),
  removeItem: jest.fn(async () => null),
};
