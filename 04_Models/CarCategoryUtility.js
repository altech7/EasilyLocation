"use strict";
(function init() {
    var mongoose = require('mongoose');
    var options = {discriminatorKey: 'kind'};
    var CarCategory = require('../04_Models/CarCategory');
    var CarUtilitySchema = new mongoose.Schema({
        assistDirection : Boolean,
        nbPorteLaterale : String,
        powerSteering: {type: [String], default: []},
        nbLateralDoors: {type: [String], default: []},
        nbPlaces : Number,
        updatedAt: Date,
        createdAt: Date
    }, options);

    /**
     * @desc Define an comportement/porperties at all save
     * @function pre
     */
    CarUtilitySchema.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    var CarUtility = CarCategory.discriminator('CarUtility', CarUtilitySchema, options);

    module.exports = CarUtility;
})();