const request = require('supertest');
const app = require('../utils/app');
const { createUser, authenticateUser } = require('../services/users');
const { fakerFR: faker } = require('@faker-js/faker');

jest.mock('../services/users');

describe('User API', () => {
    app.listen(3000);

    it('should sign up a new user and set a cookie', async () => {
        const mockUser = {
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        createUser.mockResolvedValue(mockUser);  // Simuler la fonction `createUser`

        const response = await request(app)
            .post('/api/user/signup')
            .send({
                username: mockUser.username,  // Utiliser des données aléatoires
                email: mockUser.email,        // Utiliser des données aléatoires
                password: 'password123',
            })
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);  // Vérifier le statut de la réponse
        expect(response.body.username).toBe(mockUser.username);  // Vérifier que le nom d'utilisateur est correct
        expect(response.headers['set-cookie']).toBeDefined();  // Vérifier que le cookie est présent
    });

    it('should login an existing user and set a cookie', async () => {
        const mockUser = {
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        authenticateUser.mockResolvedValue(mockUser);  // Simuler la fonction `authenticateUser`

        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: mockUser.email,  // Utiliser des données aléatoires
                password: 'password123',
            });

        expect(response.status).toBe(200);  // Vérifier le statut de la réponse
        expect(response.body.id).toBe(mockUser.id);  // Vérifier que l'ID de l'utilisateur est correct
        expect(response.headers['set-cookie']).toBeDefined();  // Vérifier que le cookie est présent
    });
});