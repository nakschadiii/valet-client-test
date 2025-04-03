const request = require('supertest');
const app = require('../utils/app');  // L'importation de ton application Express
const { registerCar, updateCar, deleteCar } = require('../services/car'); // Assure-toi de mocker ces services
const { fakerFR: faker } = require('@faker-js/faker');  // Pour générer des données aléatoires
const { v4: uuidv4 } = require('uuid');
jest.mock('../services/car');  // Mock des services

describe('Car API', () => {
    app.listen(4000);

    // Simuler une cookie d'utilisateur
    const mockUserId = uuidv4();
    const mockCar = {
        id: uuidv4(),
        registration: faker.vehicle.vrm(),
        type: faker.vehicle.type(),
        user: mockUserId,
    };

    it('should register a new car and return it', async () => {
        // Mock de la fonction registerCar
        registerCar.mockResolvedValue(mockCar);

        const response = await request(app)
            .post('/api/voitures')
            .set('Cookie', [`USR_TKN_CRNT=${mockUserId}`]) // Simuler un cookie utilisateur
            .send({
                registration: mockCar.registration,
                type: mockCar.type,
            });

        expect(response.status).toBe(200);  // Vérifier que la réponse est correcte
        expect(response.body.id).toBe(mockCar.id);  // Vérifier que l'ID de la voiture est correct
        expect(response.body.registration).toBe(mockCar.registration);  // Vérifier le numéro d'enregistrement
    });

    it('should update an existing car and return it', async () => {
        // Mock de la fonction updateCar
        updateCar.mockResolvedValue(mockCar);

        const response = await request(app)
            .put(`/api/voitures/${mockCar.id}`)
            .set('Cookie', [`USR_TKN_CRNT=${mockUserId}`]) // Simuler un cookie utilisateur
            .send({
                registration: mockCar.registration,
                type: mockCar.type,
            });

        expect(response.status).toBe(200);  // Vérifier le statut
        expect(response.body.registration).toBe(mockCar.registration);  // Vérifier le numéro d'enregistrement mis à jour
        expect(response.body.type).toBe(mockCar.type);  // Vérifier le type mis à jour
    });

    it('should delete a car and return the deleted car object', async () => {
        // Mock de la fonction deleteCar
        deleteCar.mockResolvedValue(mockCar);

        const response = await request(app)
            .delete(`/api/voitures/${mockCar.id}`)
            .set('Cookie', [`USR_TKN_CRNT=${mockUserId}`]) // Simuler un cookie utilisateur

        expect(response.status).toBe(200);  // Vérifier le statut
        expect(response.body.id).toBe(mockCar.id);  // Vérifier que la voiture supprimée a bien le bon ID
    });

});
