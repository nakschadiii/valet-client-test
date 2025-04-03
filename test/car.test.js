const { fakerFR } = require('@faker-js/faker');
const { registerCar, getCarById, updateCar, deleteCar } = require('../services/car');
const { createUser, deleteUser } = require('../services/users');

describe('Car Services with User Context', () => {
  let userId;
  let carId;

  beforeAll(async () => {
    // Créer un utilisateur test avant les tests
    const user = await createUser(fakerFR.person.firstName(), fakerFR.internet.email(), fakerFR.internet.password());
    expect(user).not.toBeNull();
    userId = user.id;
  });

  afterAll(async () => {
    // Supprimer l’utilisateur test après les tests
    await deleteUser(userId);
  });

  test('should register a new car for a user', async () => {
    const registration = fakerFR.vehicle.vrm();
    const type = fakerFR.vehicle.type();

    const car = await registerCar(userId, registration, type);
    expect(car).not.toBeNull();
    expect(car.registration).toBe(registration);
    expect(car.type).toBe(type);
    expect(car.user).toBe(userId);

    carId = car.id;
    await deleteCar(userId, carId);
  });

  test('should retrieve a user’s car by ID', async () => {
    const registration = fakerFR.vehicle.vrm();
    const type = fakerFR.vehicle.type();

    const car = await registerCar(userId, registration, type);
    expect(car).not.toBeNull();
    carId = car.id;

    const fetchedCar = await getCarById(userId, carId);
    expect(fetchedCar).not.toBeNull();
    expect(fetchedCar.id).toBe(carId);
    expect(fetchedCar.user).toBe(userId);

    await deleteCar(userId, carId);
  });

  test('should update a user’s car details', async () => {
    const registration = fakerFR.vehicle.vrm();
    const type = fakerFR.vehicle.type();

    const car = await registerCar(userId, registration, type);
    expect(car).not.toBeNull();
    carId = car.id;

    const updatedRegistration = fakerFR.vehicle.vrm();
    const updatedType = fakerFR.vehicle.type();

    const updatedCar = await updateCar(userId, carId, { registration: updatedRegistration, type: updatedType });
    expect(updatedCar).not.toBeNull();
    expect(updatedCar.registration).toBe(updatedRegistration);
    expect(updatedCar.type).toBe(updatedType);

    await deleteCar(userId, carId);
  });

  test('should return null when updating a non-existing car', async () => {
    const nonExistentCarId = 'non-existent-id';
    const updatedData = { registration: 'XYZ1234', type: 'large' };

    const updatedCar = await updateCar(userId, nonExistentCarId, updatedData);
    expect(updatedCar).toBeNull();
  });

  test('should delete a user’s car', async () => {
    const registration = fakerFR.vehicle.vrm();
    const type = fakerFR.vehicle.type();

    const car = await registerCar(userId, registration, type);
    expect(car).not.toBeNull();
    carId = car.id;

    const deletionResult = await deleteCar(userId, carId);
    expect(deletionResult).toBe(true);

    const deletedCar = await getCarById(userId, carId);
    expect(deletedCar).toBeNull();
  });

  test('should return false when deleting a non-existent car', async () => {
    const nonExistentCarId = 'non-existent-id';

    const deletionResult = await deleteCar(userId, nonExistentCarId);
    expect(deletionResult).toBe(false);
  });

  test('should not allow a user to access another user’s car', async () => {
    // Créer un autre utilisateur
    const otherUser = await createUser(fakerFR.person.firstName(), fakerFR.internet.email(), fakerFR.internet.password());
    expect(otherUser).not.toBeNull();
    const otherUserId = otherUser.id;

    // Enregistrer une voiture pour cet autre utilisateur
    const registration = fakerFR.vehicle.vrm();
    const type = fakerFR.vehicle.type();
    const otherUserCar = await registerCar(otherUserId, registration, type);
    expect(otherUserCar).not.toBeNull();
    const otherUserCarId = otherUserCar.id;

    // Essayer d’accéder à la voiture avec l’ID du premier utilisateur
    const fetchedCar = await getCarById(userId, otherUserCarId);
    expect(fetchedCar).toBeNull();

    // Essayer de supprimer la voiture d'un autre utilisateur
    const deletionResult = await deleteCar(userId, otherUserCarId);
    expect(deletionResult).toBe(false);

    // Nettoyage : supprimer la voiture et l'utilisateur secondaire
    await deleteCar(otherUserId, otherUserCarId);
    await deleteUser(otherUserId);
  });
});
