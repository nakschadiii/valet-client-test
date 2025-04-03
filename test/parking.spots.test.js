const { fakerFR } = require('@faker-js/faker');
const {
  addParkingSpot,
  updateParkingSpot,
  removeParkingSpot,
  getAllParkingSpots,
  getParkingSpotById,
  getParkingSpotsByCarType,
} = require('../services/parking.spots'); 
const { deleteParkingLot, generateParkingLot } = require('../services/parking');
const { categorizeVehicleType } = require('../services/car.types');

describe("Parking Spot Management", () => {
  let parkingId;
  let spotId;

  beforeEach(async () => {
    const city = fakerFR.location.city();
    const name = fakerFR.company.name();
    const rows = fakerFR.number.int({ min: 2, max: 10 });
    const cols = fakerFR.number.int({ min: 2, max: 10 });

    // Création d'un parking
    const newParking = await generateParkingLot(city, name, rows, cols);
    parkingId = newParking.id;
    spotId = newParking.layout[0].id; // On prend la première place comme exemple
  });

  // Après chaque test, on supprime le parking
  afterEach(async () => {
    if (parkingId) {
      await deleteParkingLot(parkingId);
    }
  });

  test("should retrieve all parking spots", async () => {
    const spots = await getAllParkingSpots(parkingId);
    expect(Array.isArray(spots)).toBe(true);
    expect(spots.length).toBeGreaterThan(0);
    expect(spots[0]).toHaveProperty('id');
    expect(spots[0]).toHaveProperty('x');
    expect(spots[0]).toHaveProperty('y');
    expect(spots[0]).toHaveProperty('vehicleType');
  });

  test("should retrieve a parking spot by ID", async () => {
    const spot = await getParkingSpotById(parkingId, spotId);
    expect(spot).toHaveProperty('id', spotId);
    expect(spot).toHaveProperty('x');
    expect(spot).toHaveProperty('y');
    expect(spot).toHaveProperty('vehicleType');
  });

  test("should add a new parking spot", async () => {
    const newSpot = {
      id: 'spot2',
      x: 2,
      y: 2,
      vehicleType: 'medium',
    };

    const updatedParking = await addParkingSpot(parkingId, newSpot);
    expect(updatedParking).not.toBeNull();
    expect(updatedParking.layout.length).toBeGreaterThan(1);
    expect(updatedParking.layout.find(spot => spot.id === 'spot2')).toBeDefined();
  });

  test("should update an existing parking spot", async () => {
    const updatedSpotData = { vehicleType: 'large' };

    const updatedParking = await updateParkingSpot(parkingId, spotId, updatedSpotData);
    expect(updatedParking).not.toBeNull();
    const updatedSpot = updatedParking.layout.find(spot => spot.id === spotId);
    expect(updatedSpot.vehicleType).toBe('large');
  });

  test("should remove a parking spot", async () => {
    const updatedParking = await removeParkingSpot(parkingId, spotId);
    expect(updatedParking).not.toBeNull();
    const remainingSpots = updatedParking.layout.filter(spot => spot.id === spotId);
    expect(remainingSpots.length).toBe(0);
  });

  test("should handle removing a non-existent parking spot", async () => {
    const nonExistentSpotId = 'non-existent-spot-id';
    const updatedParking = await removeParkingSpot(parkingId, nonExistentSpotId);
    expect(updatedParking).not.toBeNull();
    const remainingSpots = updatedParking.layout.filter(spot => spot.id === nonExistentSpotId);
    expect(remainingSpots.length).toBe(0);
  });

  test("should handle retrieving a non-existent parking spot", async () => {
    const nonExistentSpotId = 'non-existent-spot-id';
    const spot = await getParkingSpotById(parkingId, nonExistentSpotId);
    expect(spot).toBeNull();
  });

  test("should retrieve parking spots for a specific vehicle type", async () => {
    const vehicleType = fakerFR.vehicle.type();
    const spots = await getParkingSpotsByCarType(parkingId, vehicleType);
    
    expect(Array.isArray(spots)).toBe(true);
    expect(spots.length).toBeGreaterThan(0);
    spots.forEach(spot => {
      expect(spot.vehicleType).toBe(categorizeVehicleType(vehicleType));
    });
  });

  test("should return an empty array when no spots match the vehicle type", async () => {
    const vehicleType = "large";
    const spots = await getParkingSpotsByCarType(parkingId, vehicleType);
    
    expect(Array.isArray(spots)).toBe(true);
    expect(spots.length).toBe(0);
  });
});
