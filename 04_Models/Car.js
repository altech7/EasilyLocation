"use strict";
(function init() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var CarSchema = new Schema({
        agence: {type: mongoose.Schema.Types.ObjectId, ref: 'Agence'},
        category: {type: mongoose.Schema.Types.ObjectId, ref: 'CarCategory'},
        brand : String,
        active : Boolean,
        model : String,
        updatedAt : Date,
        createdAt : Date
    });

    /**
     * @desc Define an comportement/porperties at all save
     * @function pre
     */
    CarSchema.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    var Car = mongoose.model('Car', CarSchema, 'Park');

    module.exports = Car;
})();