"use strict";
(function init() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var PriceSchema = new Schema({
        days : String,
        km : String,
        price : String,
        weekend: Boolean,
        longWeekend: Boolean,
        updatedAt : Date,
        createdAt : Date,
        category: {type: mongoose.Schema.Types.ObjectId, ref: 'CarCategory'}
    });

    /**
     * @desc Define an comportement/porperties at all save
     * @function pre
     */
    PriceSchema.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    var Price = mongoose.model('Price', PriceSchema, 'Prices');

    module.exports = Price;
})();