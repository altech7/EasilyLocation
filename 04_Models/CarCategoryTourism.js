"use strict";
(function init() {
    var mongoose = require('mongoose');
    var CarCategory = require('../04_Models/CarCategory');
    var options = {discriminatorKey: 'kind'};
    var CarCategoryTourism = new mongoose.Schema({
        gearbox : String,
        numberOfDoors: {type: [Number], default: []},
        numberOfPassengersAndBaggage : String,
        minimumAgeForLocation : Number,
        requiredLicensingYearsNumber :  Number,
        airConditioner: String,
        other : String,
        updatedAt: Date,
        createdAt: Date
    }, options);

    /**
     * @desc Define an comportement/porperties at all save
     * @function pre
     */
    CarCategoryTourism.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    var CarCategoryTourism = CarCategory.discriminator('CarCategoryTourism', CarCategoryTourism, options);

    module.exports = CarCategoryTourism;
})();