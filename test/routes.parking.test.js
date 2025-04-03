const request = require('supertest');
const app = require('../utils/app');
const { getReservations, createReservation } = require('../services/parking.reservations');
const { getFreeSpots, getFreeSpotsByType } = require('../services/parking.spots');
const { getParkingLots, getParkingLot } = require('../services/parking');

jest.mock('../services/parking.reservations');
jest.mock('../services/parking');
jest.mock('../services/car');
jest.mock('../services/parking.spots');

describe('Reservation and Parking API', () => {

    // Simulation d'un ID utilisateur
    const mockUserId = 'user-1234';

    // Mock de données
    const mockReservation = {
        id: 'reservation-1234',
        userId: mockUserId,
        date: '2025-04-04',
        parkingLot: 'Lot A',
    };

    const mockParkingLot = {
        id: 'lot-1',
        name: 'Lot A',
        totalSpots: 50,
        availableSpots: 10,
    };

    const mockFreeSpots = [
        { spotId: 'spot-1', type: 'compact' },
        { spotId: 'spot-2', type: 'compact' }
    ];

    it('should get reservations for the current user', async () => {
        getReservations.mockResolvedValue([mockReservation]);

        const response = await request(app)
            .get('/api/reservations')
            .set('Cookie', [`USR_TKN_CRNT=${mockUserId}`]);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);  // Une réservation
        expect(response.body[0].id).toBe(mockReservation.id);
    });

    it('should create a new reservation', async () => {
        createReservation.mockResolvedValue(mockReservation);

        const response = await request(app)
            .post('/api/reservations')
            .set('Cookie', [`USR_TKN_CRNT=${mockUserId}`])
            .send({
                date: '2025-04-04',
                parkingLot: 'Lot A',
            });

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(mockReservation.id);
    });

    it('should get all parking lots', async () => {
        getParkingLots.mockResolvedValue([mockParkingLot]);

        const response = await request(app)
            .get('/api/parkings');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);  // Un parking
        expect(response.body[0].name).toBe(mockParkingLot.name);
    });

    it('should get a parking lot by ID', async () => {
        getParkingLot.mockResolvedValue(mockParkingLot);

        const response = await request(app)
            .get(`/api/parkings/${mockParkingLot.id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(mockParkingLot.id);
        expect(response.body.name).toBe(mockParkingLot.name);
    });

    it('should get free spots', async () => {
        getFreeSpots.mockResolvedValue(mockFreeSpots);

        const response = await request(app)
            .get('/api/spots/free');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);  // 2 spots disponibles
        expect(response.body[0].spotId).toBe(mockFreeSpots[0].spotId);
    });

    it('should get free spots by type', async () => {
        getFreeSpotsByType.mockResolvedValue(mockFreeSpots);

        const response = await request(app)
            .get(`/api/spots/free/compact`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);  // 2 spots de type 'compact'
        expect(response.body[0].spotId).toBe(mockFreeSpots[0].spotId);
    });

});
