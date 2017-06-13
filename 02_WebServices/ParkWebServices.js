'use strict';

function init(provider) {

    var authenticationHelpers = require('../01_Commons/authenticationHelpers');
    var parkProvider = require('../03_DataAccessLayer/ParkProvider');
    var locationProvider = require('../03_DataAccessLayer/LocationProvider');

    var _create = function (req, res) {
        parkProvider.create(req.body).then(function (car) {
            res.send(car);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _updateForDisabled = function (req, res) {
        parkProvider.updateForDisabled(req.params.id).then(function (car) {
            res.send(car);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _findAll = function (req, res) {
        parkProvider.findAll().then(function (park) {
            res.send(park);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _findAllAvailable = function (req, res) {
        parkProvider.findAllAvailable().then(function (park) {
            res.send(park);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _findAllAvailableByAgencyId = function (req, res) {
        parkProvider.findAllAvailableByAgencyId(req.params.id).then(function (park) {
            res.send(park);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _findAllAvailableByAgencyBetweenDates = function (req, res) {
        parkProvider.findAllAvailableByAgencyBetweenDates(req.params.idAgency, req.params.start, req.params.end).then(function (park) {
            res.send(park);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _findAllWithCategory = function (req, res) {
        parkProvider.findAllWithCategory().then(function (park) {
            res.send(park);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _findAllByCarType = function (req, res) {
        parkProvider.findAllByCarType(req.params.carType).then(function (park) {
            res.send(park);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _findAllCategories = function (req, res) {
        parkProvider.findAllCategories().then(function (categories) {
            res.send(categories);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    function _findAllAvailableCarAtNowAndComing(req, res) {
        locationProvider.findAllCurrentLocationsPopulatedByCar().then(function (currentLocations) {
            return parkProvider.findAllAvailableCarAtNowAndComingByCurrentLocation(currentLocations);
        }).then(function (availableCar) {
            res.send(availableCar);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    }

    provider.get("/park/findAll", authenticationHelpers.ensureAuthorized, _findAll);
    provider.get("/park/findAllCategories", authenticationHelpers.ensureAuthorized, _findAllCategories);
    provider.get("/park/findAllWithCategory", authenticationHelpers.ensureAuthorized, _findAllWithCategory);
    provider.get("/park/findAllAvailable", authenticationHelpers.ensureAuthorized, _findAllAvailable);
    provider.get("/park/findAllAvailableByAgencyId/:id", authenticationHelpers.ensureAuthorized, _findAllAvailableByAgencyId);
    provider.get("/park/findAllByCarType/:carType", authenticationHelpers.ensureAuthorized, _findAllByCarType);
    provider.get("/park/findAllAvailableByAgency/:idAgency/betweenDates/:start/:end", authenticationHelpers.ensureAuthorized, _findAllAvailableByAgencyBetweenDates);
    provider.post("/park/create", authenticationHelpers.ensureAuthorized, _create);
    provider.put("/park/updateForDisabled/:id", authenticationHelpers.ensureAuthorized, _updateForDisabled);
    provider.get("/park/findAllAvailableCarAtNowAndComing", authenticationHelpers.ensureAuthorized, _findAllAvailableCarAtNowAndComing);

    provider.get("/api/android/park/findAllAvailableByAgency/:idAgency/betweenDates/:start/:end", _findAllAvailableByAgencyBetweenDates);
};

module.exports = init;