'use strict';

(function init() {
    var Car = require('../04_Models/Car');

    function CarProvider() {
    }

    CarProvider.prototype.findAll = function (id, callback) {
        Car
            .find({}, function(err, cars) {
            var map = {};

            cars.forEach(function (car) {
                map[car._id] = car;
            });

        }).exec(function (err, cars) {
            callback(err, cars);
        });
    };

    CarProvider.prototype.findById = function (id, callback) {
        Car
            .findById(id)
            .exec(function (err, carFinded) {
                callback(err, carFinded);
            });
    };

    module.exports = new CarProvider();
})();