'use strict';

(function init() {
    var _ = require('underscore');
    var moment = require('moment');
    var clientProvider = require('../03_DataAccessLayer/ClientProvider');
    var carCategoryProvider = require('../03_DataAccessLayer/CarCategoryProvider');
    var DateHelper = require('../01_Commons/dateHelper');
    var Park = require('../04_Models/Park');
    var Car = require('../04_Models/Car');
    var parkJson = require('../01_Commons/json/park.json');

    function ParkProvider() {
    }

    ParkProvider.prototype.create = function (json) {
        var CarToSave = new Car({
            agence: json['agency'],
            brand: json['brand'],
            active: true,
            model: json['model'],
            category: json['category']
        });

        return CarToSave.save();
    };

    ParkProvider.prototype.updateForDisabled = function (id) {
        return Car
            .update({_id: id}, {active: "false"});
    };

    ParkProvider.prototype.findAll = function () {
        return Car
            .find({}, function (err, park) {
                var map = {};
                park.forEach(function (car) {
                    map[car._id] = car;
                });
            })
    };

    ParkProvider.prototype.findAllAvailableCarAtNowAndComingByCurrentLocation = function (currentLocations) {
        var cars = null,
            availableCars = [],
            location = null;
        return this.findAllWithCategory().then(function (activeCarsFinded) {
            cars = activeCarsFinded;
            return cars;
        }).then(function (cars) {
            cars.forEach(function (car) {
                location = _.find(currentLocations, function (location) {
                    return location.car._id.equals(car._id);
                });
                if (location) {
                    availableCars.push({
                        availableDate: moment(location.dateEnd).add(1, 'days'),
                        car: location.car
                    });
                } else {
                    availableCars.push({
                        availableDate: null,
                        car: car
                    });
                }
            });
            return availableCars
        });
    };

    ParkProvider.prototype.findAllCategories = function () {
        return carCategoryProvider.findAll();
    };

    ParkProvider.prototype.findAllWithCategory = function (carType) {
        return Car
            .find({active: true})
            .populate({
                path: 'category'
            });
    };

    ParkProvider.prototype.findAllByCarType = function (carType) {
        var promise = Car
            .find({active: true})
            .populate({
                path: 'category',
                match: {type: carType}
            });

        return promise.then(function (cars) {
            return _.filter(cars, function (item) {
                return item.category !== null;
            });
        });
    };

    ParkProvider.prototype.findAllAvailable = function () {
        return Car
            .find({active: true})
            //.find({active: true, agence: null})
            .populate({path: 'category'});
    };

    ParkProvider.prototype.findAllAvailableByAgencyBetweenDates = function (idAgency, dateStart, dateEnd) {
        var self = this,
            currentLocations = [],
            comingLocations = [],
            period = new Object({
                startDate: DateHelper.fromDateStringUrlToDate(dateStart),
                endDate: DateHelper.fromDateStringUrlToDate(dateEnd)
            });
        return clientProvider.findAll().then(function (clients) {

            return clientProvider.findAllCurrentLocations();
        }).then(function (currentLocationsFinded) {
            currentLocations = currentLocationsFinded;
            return clientProvider.findAllComingLocations();
        }).then(function (comingLocationsFinded) {
            comingLocations = comingLocationsFinded;
            //return _findAllAvailableCarsAtNowAndComingToRentBy.call(self, period, idAgency, currentLocations, comingLocations);
            return _findAllAvailableCarsAtNowAndComingToRentBy.call(self, period, idAgency, currentLocations, comingLocations);
        });
    };

    function _findAllAvailableCarsAtNowAndComingToRentBy(periodToNeedReserve, agencyId, currentLocations, comingLocations) {
        var comingAndNowAvailableCars = {
                immediatelyAvailableCars: [],
                comingAvailableCars: []
            },
            self = this;

        return self._findAllCarAvailableAtThisMomentByAgencyId(agencyId).then(function (immediatelyAvailableCarsFinded) {
            comingAndNowAvailableCars.immediatelyAvailableCars = immediatelyAvailableCarsFinded;
            comingAndNowAvailableCars.comingAvailableCars = comingAndNowAvailableCars.comingAvailableCars.concat(
                self._findAllComingAvailableCarInThisAgencyByLocations(
                    periodToNeedReserve,
                    agencyId,
                    currentLocations
                ));
            comingAndNowAvailableCars.comingAvailableCars = comingAndNowAvailableCars.comingAvailableCars.concat(
                self._findAllComingAvailableCarInThisAgencyByLocations(
                    periodToNeedReserve,
                    agencyId,
                    comingLocations
                )
            );
            comingAndNowAvailableCars.comingAvailableCars.forEach(function (comingAvailableCar) {
                comingAndNowAvailableCars.immediatelyAvailableCars.forEach(function (immediatlyAvailableCar, index) {
                    if (comingAvailableCar.car.equals(immediatlyAvailableCar._id)) {
                        comingAndNowAvailableCars.immediatelyAvailableCars.splice(index, 1);
                    }
                });
            });

            return comingAndNowAvailableCars;
        });
    };

    ParkProvider.prototype._findAllCarAvailableAtThisMomentByAgencyId = function (agencyId) {
        return Car
            .find({agence: agencyId, active: true})
            .populate({
                path: 'category'
            });
    };

    ParkProvider.prototype.findById = function (id) {
        return Car
            .find({_id: id})
            .populate({
                path: 'category'
            });
    };

    ParkProvider.prototype._findAllComingAvailableCarInThisAgencyByLocations = function (periodToNeedReserve, agencyIdWhereCarMustBeAvailable, locationsPopulatedWithCar) {
        var comingAvailableCarInAgency = [],
            periodAlreadyReserved = null,
            carComing = null,
            availableDate = null;
        var self = this;


        locationsPopulatedWithCar.forEach(function (location) {
            if (location.agenceEnd.equals(agencyIdWhereCarMustBeAvailable)) {
                periodAlreadyReserved = new Object({startDate: location.dateStart, endDate: location.dateEnd});
                availableDate = DateHelper.getEndDateOfConcurentPeriod(periodToNeedReserve, periodAlreadyReserved);
                if (availableDate) {
                    comingAvailableCarInAgency.push({
                        availableDate: availableDate,
                        car: location.car
                    });
                }
            }
        });

        return comingAvailableCarInAgency;
    };

    ParkProvider.prototype.initDefaultPark =
        function _initDefaultPark(agencies, categories) {
            var parkToSave = new Park();
            var i = 0;
            parkJson.cars.forEach(function (item) {
                var rand = Math.floor(Math.random() * agencies.length);
                parkToSave.cars.push(new Car({
                    brand: item.brand,
                    active: item.active,
                    model: item.model,
                    agence: agencies[rand]._id,
                    category: _.findWhere(categories, {category: item.category})
                }));
                i++;
            });

            return Car.create(parkToSave.cars);
        };

    module.exports = new ParkProvider();
})();