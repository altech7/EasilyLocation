'use strict';

(function init() {
    var CarCategory = require('../04_Models/CarCategory');
    var CarCategoryTourism = require('../04_Models/CarCategoryTourism');
    var CarCategoryUtility = require('../04_Models/CarCategoryUtility');
    var categoriesJson = require('../01_Commons/json/categories.json');

    function CarCategoryProvider() {
    }

    CarCategoryProvider.prototype.findById = function (id) {
        return CarCategory
            .find({_id: id})
            .exec();
    };

    CarCategoryProvider.prototype.initAllDefaultCategories = function () {
        var carCategories = [],
            tourismCarCategories = [],
            utilityCarCategories = [],
            carCategoriesSaved = [];

        categoriesJson.TOURISM.categories.forEach(function (item) {
            tourismCarCategories.push(new CarCategoryTourism({
                type: item.type,
                category: item.category,
                name: item.name,
                numberOfDoors: item.numberOfDoors,
                engine: item.engine,
                audio: item.audio,
                gearbox: item.gearbox,
                numberOfPassengersAndBaggage: item.numberOfPassengersAndBaggage,
                minimumAgeForLocation: item.minimumAgeForLocation,
                requiredLicensingYearsNumber: item.requiredLicensingYearsNumber,
                airConditioner: item.airConditioner,
                other: item.other
            }));
        });
        categoriesJson.UTILITY.categories.forEach(function (item) {
            utilityCarCategories.push(new CarCategoryUtility({
                type: item.type,
                category: item.category,
                name: item.name,
                numberOfDoors: item.numberOfDoors,
                engine: item.engine,
                audio: item.audio,
                powerSteering: item.powerSteering,
                nbLateralDoors: item.nbLateralDoors,
                nbPlaces: item.nbPlaces
            }));
        });

        return CarCategoryTourism.create(tourismCarCategories).then(function (saved) {
            carCategoriesSaved = carCategoriesSaved.concat(saved);
            return CarCategoryUtility.create(utilityCarCategories);
        }).then(function (saved) {
            return carCategoriesSaved.concat(saved);
        });
    };

    CarCategoryProvider.prototype.findAll = function () {
        return CarCategory
            .find({});
    };

    module.exports = new CarCategoryProvider();
})();