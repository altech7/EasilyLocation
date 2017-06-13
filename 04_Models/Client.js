'use strict';

(function init() {
    var bcrypt = require('bcrypt-nodejs');
    var mongoose = require('mongoose');
    var Location = require('./Location');
    var Schema = mongoose.Schema;
    var ClientSchema = new Schema({
        firstName: String,
        lastName: String,
        dateOfBirth: Date,
        dateDriverLicence : Date,
        updatedAt: Date,
        createdAt: Date,
        address: String,
        currentLocations: {type: [Location.schema], default: []},
        closedLocations: {type: [Location.schema], default: []},
        comingLocations: {type: [Location.schema], default: []}
    });

    // on every save, add the date
    ClientSchema.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    var Client = mongoose.model('Client', ClientSchema, 'Clients');

    module.exports = Client;

})();