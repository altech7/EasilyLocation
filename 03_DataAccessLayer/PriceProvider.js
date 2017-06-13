'use strict';

(function init() {
    var _ = require('underscore');
    var Price = require('../04_Models/Price');
    var Car = require('../04_Models/Car');
    var parkProvider = require('../03_DataAccessLayer/ParkProvider');

    function PriceProdiver() {
    }

    PriceProdiver.prototype.create = _create;

    PriceProdiver.prototype.generatePrice = function (duration, km, carId) {
        var multiplicityIndex = 1,
            categoryId = null,
            durationValid = false,
            kmValid = false,
            basePrice = 0,
            priceDayReferenceToUse = null,
            pricesReferenceToCalculByKm = [],
            priceByKm = 0,
            kmIsLowerThatAll = false;

        return this.findCarById(carId).then(function (car) {

            categoryId = car[0].category._id;

            return Price.find({category: categoryId});

        }).then(function (prices) {

            if (!prices || prices.length === 0) {
                throw new NotFoundError('Aucun prix trouvé pour la catégorie avec l\'id ' + categoryId);
            }
            prices = _.sortBy(prices, function (item) {
                return item.days;
            });
            while (!durationValid) {
                for (var i = 0; i < prices.length; i++) {
                    if (duration <= prices[i].days) {
                        durationValid = true;
                        priceDayReferenceToUse = prices[i].days;
                        break;
                    }
                }
                if (!durationValid) {
                    multiplicityIndex++;
                    duration /= 2;
                }
            }
            pricesReferenceToCalculByKm = _.filter(prices, function (item) {
                return item.days === priceDayReferenceToUse;
            });

            pricesReferenceToCalculByKm = _.sortBy(pricesReferenceToCalculByKm, function (item) {
                return -item.km;
            });

            while (!kmValid) {
                while (!kmIsLowerThatAll) {
                    kmIsLowerThatAll = true;
                    for (var i = 0; i < pricesReferenceToCalculByKm.length; i++) {
                        if (km >= pricesReferenceToCalculByKm[i].km) {
                            km -= pricesReferenceToCalculByKm[i].km;
                            kmIsLowerThatAll = false;
                            basePrice += pricesReferenceToCalculByKm[i].price;
                            break;
                        }
                    }
                    if (kmIsLowerThatAll) {
                        kmValid = true;
                    }
                }
            }
            if (km != 0) {
                basePrice += _.last(pricesReferenceToCalculByKm).price;
            }

            var json = {
                price: basePrice * multiplicityIndex
            };
            return json;
        }).catch(function (err) {
            console.error(err);
            return new Error(
                'Erreur interne lors de la génération du prix.');
        });
    };

    PriceProdiver.prototype.findCarById = function (id) {
        return Car
            .find({_id: id})
            .populate({
                path: 'category'
            });
    };

    PriceProdiver.prototype.findAll = function () {
        return Price
            .find()
            .populate({
                path: 'category'
            });
    };

    function _create(json) {
        var price = {
            days: (!json.days ? null : json.days),
            km: (!json.km ? null : json.km),
            price: (!json.price ? null : json.price),
            weekend: (json.weekend === undefined || json.weekend === null ? null : json.weekend),
            longWeekend: (json.longWeekend === undefined || json.longWeekend === null ? null : json.longWeekend),
            category: json.category
        };
        return new Price(price);
    }

    PriceProdiver.prototype.initAllDefaultPrice = function (categories, callback) {
        var prices = [];
        var pricesJson = require('../01_Commons/json/prices.json');

        for (var key in pricesJson.TOURISM.Categories) {
            pricesJson.TOURISM.Categories[key].forEach(function (item) {
                prices.push(this.create({
                    days: item.days,
                    km: item.km,
                    price: item.price,
                    weekend: item.weekend,
                    longWeekend: item.longWeekend,
                    category: _.findWhere(categories, {category: key})
                }));
            }.bind(this));
        }

        for (var key in pricesJson.UTILITY.Categories) {
            pricesJson.UTILITY.Categories[key].forEach(function (item) {
                prices.push(this.create({
                    days: item.days,
                    km: item.km,
                    price: item.price,
                    weekend: item.weekend,
                    longWeekend: item.longWeekend,
                    category: _.findWhere(categories, {category: key})
                }));
            }.bind(this));
        }

        return Price.create(prices);
    };

    module.exports = new PriceProdiver();
})();