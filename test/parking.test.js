const { fakerFR } = require("@faker-js/faker");
const {
  generateParkingLot,
  getParkingLot,
  getParkingLots,
  updateParkingLot,
  deleteParkingLot,
  generateParkingLayout,
  getParkingLotByNameAndCity
} = require("../services/parking");

describe("Parking Service Tests", () => {
  test("should create a new parking lot", async () => {
    const city = fakerFR.location.city();
    parkingName = fakerFR.company.name();
    const rows = fakerFR.number.int({ min: 2, max: 10 });
    const cols = fakerFR.number.int({ min: 2, max: 10 });

    const newParking = await generateParkingLot(city, parkingName, rows, cols);
    expect(newParking).not.toBeNull();
    expect(newParking.city).toBe(city);
    expect(newParking.name).toBe(parkingName);
    expect(newParking.layout.length).toBe(rows * cols);

    const retrievedParking = await getParkingLot(newParking.id);
    expect(retrievedParking).not.toBeNull();
    expect(retrievedParking.id).toBe(newParking.id);

    const deleteSuccess = await deleteParkingLot(newParking.id);
    expect(deleteSuccess).toBe(true);
  });

  test("should retrieve parking lots", async () => {
    const city = fakerFR.location.city();
    parkingName = fakerFR.company.name();
    const rows = fakerFR.number.int({ min: 2, max: 10 });
    const cols = fakerFR.number.int({ min: 2, max: 10 });

    const newParking = await generateParkingLot(city, parkingName, rows, cols);

    const parkings = await getParkingLots(); 
    expect(Array.isArray(parkings)).toBe(true);
    expect(parkings.length).toBeGreaterThan(0);
    expect(parkings[0]).toHaveProperty('id');
    expect(parkings[0]).toHaveProperty('name');
    expect(parkings[0]).toHaveProperty('city');

    const deleteSuccess = await deleteParkingLot(newParking.id);
    expect(deleteSuccess).toBe(true);
  });

  test("should retrieve a parking lot", async () => {
    const city = fakerFR.location.city();
    parkingName = fakerFR.company.name();
    const rows = fakerFR.number.int({ min: 2, max: 10 });
    const cols = fakerFR.number.int({ min: 2, max: 10 });

    const newParking = await generateParkingLot(city, parkingName, rows, cols);

    const retrievedParking = await getParkingLot(newParking.id);
    expect(retrievedParking).not.toBeNull();
    expect(retrievedParking.id).toBe(newParking.id);
    expect(retrievedParking.name).toBe(newParking.name);
    expect(retrievedParking.city).toBe(newParking.city);

    const deleteSuccess = await deleteParkingLot(newParking.id);
    expect(deleteSuccess).toBe(true);
  });

  test("should retrieve a parking lot by name and city", async () => {
    const city = fakerFR.location.city();
    const name = fakerFR.company.name();
  
    // Crée un parking avec ces informations avant de tester
    const createdParking = await generateParkingLot(city, name, 5, 5);
  
    // Utilise la fonction pour récupérer le parking
    const retrievedParking = await getParkingLotByNameAndCity(city, name);
  
    expect(retrievedParking).not.toBeNull();
    expect(retrievedParking.city).toBe(city);
    expect(retrievedParking.name).toBe(name);
  
    // Nettoyage : suppression du parking après le test
    const deleteSuccess = await deleteParkingLot(createdParking.id);
    expect(deleteSuccess).toBe(true);
  });

  test("should update a parking lot", async () => {
    const city = fakerFR.location.city();
    parkingName = fakerFR.company.name();
    const rows = fakerFR.number.int({ min: 2, max: 10 });
    const cols = fakerFR.number.int({ min: 2, max: 10 });
    const newParking = await generateParkingLot(city, parkingName, rows, cols);
    const newParkingId = newParking.id;
    
    const newName = fakerFR.company.name();
    const updatedParking = await updateParkingLot(newParkingId, { name: newName });

    expect(updatedParking).not.toBeNull();
    expect(updatedParking.name).toBe(newName);

    const retrievedParking = await getParkingLot(newParkingId);
    expect(retrievedParking).not.toBeNull();
    expect(retrievedParking.name).toBe(newName);

    const deleteSuccess = await deleteParkingLot(newParkingId);
    expect(deleteSuccess).toBe(true);
  });

  test("should update parking lot without any actual changes", async () => {
    const city = fakerFR.location.city();
    const parkingName = fakerFR.company.name();
    const rows = 5;
    const cols = 5;
  
    const newParking = await generateParkingLot(city, parkingName, rows, cols);
    const updatedParking = await updateParkingLot(newParking.id, { name: newParking.name }); // Pas de changement réel
    
    expect(updatedParking).toBeDefined();
    expect(updatedParking.name).toBe(newParking.name);
    
    const deleteSuccess = await deleteParkingLot(newParking.id);
    expect(deleteSuccess).toBe(true);
  });

  test("should delete a parking lot", async () => {
    const city = fakerFR.location.city();
    parkingName = fakerFR.company.name();
    const rows = fakerFR.number.int({ min: 2, max: 10 });
    const cols = fakerFR.number.int({ min: 2, max: 10 });
    const newParking = await generateParkingLot(city, parkingName, rows, cols);
    const newParkingId = newParking.id;

    const deleteSuccess = await deleteParkingLot(newParkingId);
    expect(deleteSuccess).toBe(true);

    const retrievedParking = await getParkingLot(newParkingId);
    expect(retrievedParking).toBeNull();

    const parkings = await getParkingLots();
    const exists = parkings.some(p => p.id === newParkingId);
    expect(exists).toBe(false);
  });

  // Test : Should not create a parking lot with missing city
  test("should not create parking lot with missing city", async () => {
    try {
      await generateParkingLot("", "Test Parking", 5, 5);
    } catch (error) {
      expect(error.message).toBe("Le nom de la ville et du parking sont obligatoires.");
    }
  });

  // Test : Should not create a parking lot with missing name
  test("should not create parking lot with missing name", async () => {
    try {
      await generateParkingLot("Paris", "", 5, 5);
    } catch (error) {
      expect(error.message).toBe("Le nom de la ville et du parking sont obligatoires.");
    }
  });

  // Test : Should not create parking lot with random negative rows and cols
  test("should not create parking lot with random negative dimensions", async () => {
    const randomNegativeValue = () => fakerFR.number.int({ min: -10, max: -1 });

    try {
      await generateParkingLot("Paris", "Test Parking", randomNegativeValue(), randomNegativeValue());
    } catch (error) {
      expect(error.message).toBe("Les dimensions du parking doivent être positives.");
    }
  });

  test("should create a large parking lot", async () => {
    const city = fakerFR.location.city();
    const name = fakerFR.company.name();
    const rows = 100;
    const cols = 100;

    const newParking = await generateParkingLot(city, name, rows, cols);
    expect(newParking).not.toBeNull();
    expect(newParking.layout.length).toBe(rows * cols);

    const deleteSuccess = await deleteParkingLot(newParking.id);
    expect(deleteSuccess).toBe(true);
  });

  test("should generate parking layout correctly", () => {
    const rows = 5;
    const cols = 5;
    const layout = generateParkingLayout(rows, cols);

    expect(layout.length).toBe(rows * cols);
    layout.forEach((spot) => {
      expect(spot).toHaveProperty('id');
      expect(spot).toHaveProperty('x');
      expect(spot).toHaveProperty('y');
      expect(spot).toHaveProperty('vehicleType');
      expect(['small', 'medium', 'large', 'unknown']).toContain(spot.vehicleType);
    });
  });

  test("should return false when trying to delete a non-existent parking lot", async () => {
    const deleteSuccess = await deleteParkingLot("non-existent-id");
    expect(deleteSuccess).toBe(false);
  });

  test("should return null when trying to update a non-existent parking lot", async () => {
    const updatedParking = await updateParkingLot("non-existent-id", { name: "Updated Name" });
    expect(updatedParking).toBeNull();
  });

  test("should handle deleting an already deleted parking lot", async () => {
    const city = fakerFR.location.city();
    parkingName = fakerFR.company.name();
    const rows = fakerFR.number.int({ min: 2, max: 10 });
    const cols = fakerFR.number.int({ min: 2, max: 10 });
    const newParking = await generateParkingLot(city, parkingName, rows, cols);
    const newParkingId = newParking.id;

    await deleteParkingLot(newParkingId);
    const deleteSuccessAgain = await deleteParkingLot(newParkingId);
    expect(deleteSuccessAgain).toBe(false);
  });

  test("should not create duplicate parking lot in the same city", async () => {
    const city = fakerFR.location.city();
    const parkingName = fakerFR.company.name();
    const rows = fakerFR.number.int({ min: 2, max: 10 });
    const cols = fakerFR.number.int({ min: 2, max: 10 });
  
    const firstParking = await generateParkingLot(city, parkingName, rows, cols);
    try {
      await generateParkingLot(city, parkingName, rows, cols);
    } catch (error) {
      expect(error.message).toBe("Un parking avec ce nom existe déjà dans cette ville.");
    }
    
    await deleteParkingLot(firstParking.id);
  });
});
