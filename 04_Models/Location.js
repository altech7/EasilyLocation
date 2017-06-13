"use strict";
(function init() {
    var mongoose = require('mongoose');
    var Agence = require('./Agence');
    var Price = require('./Price');
    var Car = require('./Car');
    var Schema = mongoose.Schema;
    var LocationSchema = new Schema({
        updatedAt: Date,
        createdAt: Date,
        kms: String,
        kmsPenalty: String,
        duration: Date,
        dateStart: Date,
        dateEnd: Date,
        hoursStart: Number,
        hoursEnd: Number,
        price: Number,
        pricePenalty: Number,
        pricesApplied: {type: [Price.schema], default: []},
        agenceStart: {type: mongoose.Schema.Types.ObjectId, ref: 'Agence'},
        agenceEnd: {type: mongoose.Schema.Types.ObjectId, ref: 'Agence'},
        car: {type: mongoose.Schema.Types.ObjectId, ref: 'Car'}
    });

    /**
     * @desc Define an comportement/porperties at all save
     * @function pre
     */
    LocationSchema.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    var Location = mongoose.model('Location', LocationSchema, 'Locations');

    module.exports = Location;
})();