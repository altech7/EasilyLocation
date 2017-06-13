"use strict";
(function init() {
    var mongoose = require('mongoose');
    var Car = require('./Car');
    var Schema = mongoose.Schema;
    var ParkSchema = new Schema({
        updatedAt: Date,
        createdAt: Date,
        cars: {type: [Car.schema], default: []}
    });

    /**
     * @desc Define an comportement/porperties at all save
     * @function pre
     */
    ParkSchema.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    var Park = mongoose.model('Park', ParkSchema, 'Parks');

    module.exports = Park;
})();