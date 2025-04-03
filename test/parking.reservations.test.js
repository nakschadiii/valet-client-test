const { faker } = require('@faker-js/faker');
const { createUser, deleteUser } = require('../services/users');
const {
  createReservation,
  getReservationById,
  updateReservation,
  deleteReservation,
  getReservationsByParkingLot,
  getReservationsByParkingSpot,
  getReservationsByCar
} = require('../services/parking.reservations');
const { registerCar, deleteCar } = require('../services/car');
const { addParkingSpot } = require('../services/parking.spots');
const { generateParkingLot, deleteParkingLot } = require('../services/parking');

describe('Parking Reservations Service with User Context', () => {
  let userId;
  let carId;
  let parkingLotId;
  let parkingSpotId;
  let reservationId;

  beforeAll(async () => {
    // Créer un utilisateur pour les tests
    const user = await createUser(faker.internet.username(), faker.internet.email(), faker.internet.password());
    expect(user).not.toBeNull();
    userId = user.id;

    // Créer une voiture pour les tests
    const car = await registerCar(userId, faker.vehicle.vrm(), faker.vehicle.type());
    carId = car.id;

    // Créer un parking et une place de parking
    const parkingLot = await generateParkingLot(faker.location.city(), faker.location.zipCode());
    parkingLotId = parkingLot.id;
    
    const parkingSpot = await addParkingSpot(parkingLotId, 'small');
    parkingSpotId = parkingSpot.id;
  });

  test('should create a reservation successfully', async () => {
    const reservation = await createReservation(parkingLotId, parkingSpotId, carId, new Date(), new Date());
    expect(reservation).not.toBeNull();
    expect(reservation.id_parking_lot).toBe(parkingLotId);
    expect(reservation.id_parking_spot).toBe(parkingSpotId);
    expect(reservation.id_car).toBe(carId);

    // Stocker l'ID de la réservation pour les tests suivants
    reservationId = reservation.id;

    // Supprimer la réservation après le test
    await deleteReservation(reservationId);
  });

  test('should retrieve a reservation by ID', async () => {
    // Créer une réservation pour ce test
    const reservation = await createReservation(parkingLotId, parkingSpotId, carId, new Date(), new Date());
    reservationId = reservation.id;

    const fetchedReservation = await getReservationById( reservationId);
    expect(fetchedReservation).not.toBeNull();
    expect(fetchedReservation.id).toBe(reservationId);
    expect(fetchedReservation.id_parking_lot).toBe(parkingLotId);
    expect(fetchedReservation.id_parking_spot).toBe(parkingSpotId);
    expect(fetchedReservation.id_car).toBe(carId);

    // Supprimer la réservation après le test
    await deleteReservation(reservationId);
  });

  test('should update reservation details', async () => {
    // Créer une réservation pour ce test
    const reservation = await createReservation( parkingLotId, parkingSpotId, carId, new Date(), new Date());
    reservationId = reservation.id;

    const updatedReservation = await updateReservation( reservationId, { date_departure: new Date() });
    expect(updatedReservation).not.toBeNull();
    expect(updatedReservation.date_departure).toBeDefined();

    // Supprimer la réservation après le test
    await deleteReservation(reservationId);
  });

  test('should delete a reservation successfully', async () => {
    // Créer une réservation pour ce test
    const reservation = await createReservation(parkingLotId, parkingSpotId, carId, new Date(), new Date());
    reservationId = reservation.id;

    const deletionResult = await deleteReservation( reservationId);
    expect(deletionResult).toBe(true);

    const deletedReservation = await getReservationById( reservationId);
    expect(deletedReservation).toBeNull();
  });

  test('should return false when deleting a non-existent reservation', async () => {
    const deletionResult = await deleteReservation('non-existent-id');
    expect(deletionResult).toBe(false);
  });

  test('should retrieve all reservations by parking lot', async () => {
    // Créer une réservation pour ce test
    const reservation = await createReservation(parkingLotId, parkingSpotId, carId, new Date(), new Date());
    reservationId = reservation.id;

    const reservations = await getReservationsByParkingLot(parkingLotId);
    expect(reservations.length).toBeGreaterThan(0);  // Au moins une réservation doit exister

    // Supprimer la réservation après le test
    await deleteReservation(reservationId);
  });

  test('should retrieve all reservations by parking spot', async () => {
    // Créer une réservation pour ce test
    const reservation = await createReservation(parkingLotId, parkingSpotId, carId, new Date(), new Date());
    reservationId = reservation.id;

    const reservations = await getReservationsByParkingSpot( parkingSpotId);
    expect(reservations.length).toBeGreaterThan(0);  // Au moins une réservation doit exister

    // Supprimer la réservation après le test
    await deleteReservation(reservationId);
  });

  test('should retrieve all reservations by car', async () => {
    // Créer une réservation pour ce test
    const reservation = await createReservation(parkingLotId, parkingSpotId, carId, new Date(), new Date());
    reservationId = reservation.id;

    const reservations = await getReservationsByCar(carId);
    expect(reservations.length).toBeGreaterThan(0);  // Au moins une réservation doit exister

    // Supprimer la réservation après le test
    await deleteReservation(reservationId);
  });

  afterAll(async () => {
    // Nettoyer après tous les tests, si des données restent
    await deleteReservation(reservationId);
    await deleteCar(carId);
    await deleteParkingLot(parkingLotId);
    await deleteUser(userId);
  });
});
