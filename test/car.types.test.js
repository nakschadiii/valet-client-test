const { fakerFR } = require("@faker-js/faker");
const { categorizeVehicleType } = require("../services/car.types");

describe('categorizeVehicleType', () => {
    test('should categorize generated vehicle types correctly', () => {
      const vehicleType = fakerFR.vehicle.type();
      const result = categorizeVehicleType(vehicleType);
      expect(result).toMatch(/small|medium|large/);
    });

    test('should return "unknown" for unknown vehicle types', () => {
      const vehicleType = fakerFR.word.interjection();
      const result = categorizeVehicleType(vehicleType);
      expect(result).toBe("unknown");
    });
});