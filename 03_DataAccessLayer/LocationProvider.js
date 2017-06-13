'use strict';

(function init() {
    var DateHelper = require('../01_Commons/dateHelper');
    var clientProvider = require('../03_DataAccessLayer/ClientProvider');
    var parkProvider = require('../03_DataAccessLayer/ParkProvider');
    var categoryProvider = require('../03_DataAccessLayer/CarCategoryProvider');
    var Location = require('../04_Models/Location');
    var Client = require('../04_Models/Client');
    var Price = require('../04_Models/Price');
    var _ = require('underscore');

    function LocationProvider() {
    }

    LocationProvider.prototype.addComingLocationToClient = function (id, json) {
        try {
            DateHelper.verifyDates(json.dateStart, json.dateEnd, json.hoursStart, json.hoursEnd);
        } catch (err) {
            throw err;
        }

        var locationToAdd = new Location({
            kms: json.kms,
            dateStart: json.startDate,
            dateEnd: json.endDate,
            hoursStart: json.hoursStart,
            hoursEnd: json.hoursEnd,
            price: json.price,
            agenceStart: json.startAgency,
            agenceEnd: json.endAgency,
            car: json.car,
            pricesApplied: []
        });

        return clientProvider.addComingLocation(id, locationToAdd);
    };

    LocationProvider.prototype.modifyLocationOfClient = function (idClient, idLocation, json) {
        try {
            DateHelper.verifyDates(json.dateStart, json.dateEnd, json.hoursStart, json.hoursEnd);
        } catch (err) {
            throw err;
        }

        var locationToModify = new Location({
            kms: json.kms
        });
        return clientProvider.modifyLocation(idClient, idLocation, locationToModify);
    };

    LocationProvider.prototype.archiveLocationOfClient = function (idClient, idLocation) {
        return clientProvider.archiveLocation(idClient, idLocation);
    };

    LocationProvider.prototype.clotureLocationOfClient = function (idClient, idLocation, kms) {
        return clientProvider.clotureLocation(idClient, idLocation, kms);
    };

    LocationProvider.prototype.confirmLocationOfClient = function (idClient, idLocation) {
        return clientProvider.confirmLocation(idClient, idLocation);
    };

    LocationProvider.prototype.findAllWithCarsAndAgencies = function () {
        return clientProvider.findAllWithCarsAndAgencies();
    };

    LocationProvider.prototype.findAllCurrentLocationsPopulatedByCar = function () {
        var currentLocations = [], locations = [];
        return clientProvider.findAllWithCarsAndAgencies().then(function (clients) {
            clients.forEach(function (client) {
                currentLocations = currentLocations.concat(client.currentLocations);
            });
            return currentLocations;
        });
    };

    LocationProvider.prototype.findAllCompletelyPopulatedByCarRented = function () {
        return Client.find({})
            .populate('currentLocations.car')
            .populate('comingLocations.car')
            .populate('closedLocations.car')
            .catch(function (err) {
                console.error(err);
                return new Error('Erreur lors de la récupération des clients.');
            });
    };

    module.exports = new LocationProvider();
})();