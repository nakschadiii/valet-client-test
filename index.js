const { fakerFR } = require("@faker-js/faker");
const { getFreeSpotsByType } = require("./services/parking.spots");
const app = require("./utils/app");
const { createUser } = require("./services/users");
const { registerCar } = require("./services/car");
const { createReservation, getReservationsByUser } = require("./services/parking.reservations");

const PORT = process.env.PORT || 3000
app.listen(PORT);
console.log(PORT+' is the magic port');

/*getFreeSpotsByType(fakerFR.vehicle.type()).then((freeSpots) => {
    console.log(freeSpots);
});*/


createUser(fakerFR.internet.username(), fakerFR.internet.email(), fakerFR.internet.password()).then((user) => {
    registerCar(user.id, fakerFR.vehicle.vin(), fakerFR.vehicle.type()).then((car) => {
        getFreeSpotsByType(car.type).then((freeSpots) => {
            [freeSpot] = Object.entries(freeSpots).map(([key, value]) => value.map(spot => ({ ...spot, idParkingLot: key }))).flat();
            if (freeSpot) {
                createReservation(freeSpot.idParkingLot, freeSpot.id, car.id, new Date(), new Date()).then((reservation) => {
                    getReservationsByUser(user.id).then((reservations) => {
                        console.log(reservations);
                    })
                });
            }
        })
    })
});