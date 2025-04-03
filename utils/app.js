var express = require('express');
const path = require('path');
const { createUser, authenticateUser } = require('../services/users');
const { getCarById, registerCar, updateCar, deleteCar } = require('../services/car');
const cookieParser = require('cookie-parser');
const { getReservations, createReservation } = require('../services/parking.reservations');
const { getFreeSpots, getFreeSpotsByType } = require('../services/parking.spots');
const { getParkingLot, getParkingLots } = require('../services/parking');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static('assets'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get('/', (req, res) => res.render('index', { page: 'index' }));
app.get('/history', (req, res) => res.render('index', { page: 'history' }));
app.get('/reservations/:id', (req, res) => res.render('index', { page: 'reservation', id: req.params.id }));
app.get('/scan/:id', (req, res) => res.render('index', { page: 'scan' }));
app.get('/new', (req, res) => res.render('index', { page: 'new' }));

app.post('/api/user/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await createUser(username, email, password);
        res.status(200).cookie('USR_TKN_CRNT', user.id).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Unable to create user' });
    }
});

app.post('/api/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authenticateUser(email, password);
        res.status(200).cookie('USR_TKN_CRNT', user.id).json(user);
    } catch (error) {
        console.error(error);
        res.status(401).send({ error: 'Invalid credentials' });
    }
});

app.get('/api/voitures', async (req, res) => {
    try {
        console.log(req.cookies);
        const cars = await getCarById(req.cookies.USR_TKN_CRNT, req.params.id);
        res.status(200).json(cars);
    } catch (error) {
        console.error(error);
        res.status(404).send({ error: 'Car not found' });
    }
});

app.post('/api/voitures', async (req, res) => {
    try {
        const newCar = await registerCar(req.cookies.USR_TKN_CRNT, req.body.registration, req.body.type);
        res.status(200).json(newCar);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Unable to create car' });
    }
});

app.put('/api/voitures/:id', async (req, res) => {
    try {
        const updatedCar = await updateCar(req.cookies.USR_TKN_CRNT, req.params.id, req.body);
        res.status(200).json(updatedCar);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Unable to update car' });
    }
});

app.delete('/api/voitures/:id', async (req, res) => {
    try {
        const deletedCar = await deleteCar(req.cookies.USR_TKN_CRNT, req.params.id);
        res.status(200).json(deletedCar);
    } catch (error) {
        console.error(error);
        res.status(404).send({ error: 'Car not found' });
    }
});

app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await getReservations(req.cookies.USR_TKN_CRNT);
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(404).send({ error: 'No reservations found' });
    }
});

app.post('/api/reservations', async (req, res) => {
    try {
        const newReservation = await createReservation(req.cookies.USR_TKN_CRNT, req.body);
        res.status(200).json(newReservation);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Unable to create reservation' });
    }
});

app.get('/api/parkings', async (req, res) => {
    try {
        const parkings = await getParkingLots();
        res.status(200).json(parkings);
    } catch (error) {
        console.error(error);
        res.status(404).send({ error: 'No parkings found' });
    }
});

app.get('/api/parkings/:id', async (req, res) => {
    try {
        const parking = await getParkingLot(req.params.id);
        res.status(200).json(parking);
    } catch (error) {
        console.error(error);
        res.status(404).send({ error: 'Parking not found' });
    }
});

app.get('/api/spots/free', async (req, res) => {
    try {
        const freeSpots = await getFreeSpots();
        res.status(200).json(freeSpots);
    } catch (error) {
        console.error(error);
        res.status(404).send({ error: 'No free spots found' });
    }
});

app.get('/api/spots/free/:type', async (req, res) => {
    try {
        const freeSpots = await getFreeSpotsByType(req.params.type);
        res.status(200).json(freeSpots);
    } catch (error) {
        console.error(error);
        res.status(404).send({ error: 'No free spots found for this type' });
    }
});

module.exports = app
