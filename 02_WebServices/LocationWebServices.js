'use strict';

function init(provider) {

    var authenticationHelpers = require('../01_Commons/authenticationHelpers');
    var locationProvider = require('../03_DataAccessLayer/LocationProvider');
    var priceProvider = require('../03_DataAccessLayer/PriceProvider');
    var clientProvider = require('../03_DataAccessLayer/ClientProvider');

    var _findAllWithCarsAndAgencies = function (req, res) {
        locationProvider.findAllWithCarsAndAgencies().then(function (clients) {
            res.send(clients);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _addComingLocationToClient = function (req, res) {
        locationProvider.addComingLocationToClient(req.params.id, req.body).then(function (client) {
            res.send(client);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _modifyLocationOfClient = function (req, res) {
        locationProvider.modifyLocationOfClient(req.params.idClient, req.params.idLocation, req.body).then(function (client) {
            res.send(client);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _clotureLocationOfClient = function (req, res) {
        locationProvider.clotureLocationOfClient(req.params.idClient, req.params.idLocation, req.params.kms).then(function (client) {
            res.send(client);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _archiveLocationOfClient = function (req, res) {
        locationProvider.archiveLocationOfClient(req.params.idClient, req.params.idLocation).then(function (client) {
            res.send(client);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _confirmLocationOfClient = function (req, res) {
        locationProvider.confirmLocationOfClient(req.params.idClient, req.params.idLocation).then(function (client) {
            res.send(client);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _generatePrice = function (req, res) {
        priceProvider.generatePrice(req.params.duration, req.params.kms, req.params.carId).then(function (prix) {
            res.send(prix);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _findAllPrices = function (req, res) {
        priceProvider.findAll().then(function (prices) {
            res.send(prices);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _addComingLocationToClientFromApiAndroid = function (req, res) {
        clientProvider.addComingLocationToClientFromApiAndroid(req.body).then(function (client) {
            res.send(client);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _updatePricesApplied = function (req, res) {
        clientProvider.updatePricesApplied(req.params.idClient, req.params.idLocation, req.body).then(function (client) {
            res.send(client);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    provider.get("/locations/findAllWithCarsAndAgencies", authenticationHelpers.ensureAuthorized, _findAllWithCarsAndAgencies);
    provider.put("/locations/addComingLocationToClient/:id", authenticationHelpers.ensureAuthorized, _addComingLocationToClient);
    provider.put("/locations/modify/:idLocation/client/:idClient", authenticationHelpers.ensureAuthorized, _modifyLocationOfClient);
    provider.put("/locations/cloture/:idLocation/kms/:kms/client/:idClient", authenticationHelpers.ensureAuthorized, _clotureLocationOfClient);
    provider.put("/locations/archive/:idLocation/client/:idClient", authenticationHelpers.ensureAuthorized, _archiveLocationOfClient);
    provider.put("/locations/confirm/:idLocation/client/:idClient", authenticationHelpers.ensureAuthorized, _confirmLocationOfClient);
    provider.get("/locations/generatePrice/:duration/:kms/:carId", authenticationHelpers.ensureAuthorized, _generatePrice);
    provider.get("/locations/findAllPrices", authenticationHelpers.ensureAuthorized, _findAllPrices);
    provider.put("/locations/:idLocation/updatePricesApplied/client/:idClient", authenticationHelpers.ensureAuthorized, _updatePricesApplied);

    provider.post("/api/android/locations/addComing", _addComingLocationToClientFromApiAndroid);
};

module.exports = init;