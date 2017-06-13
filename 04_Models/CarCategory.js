"use strict";
(function init() {
    var mongoose = require('mongoose');
    var options = {discriminatorKey: 'kind'};
    var CarCategorySchema = new mongoose.Schema({
        name : String,
        type : String,
        category : String,
        audio: {type: [String], default: []},
        engine: {type: [String], default: []},
        updatedAt : Date,
        createdAt : Date
    }, options);

    /**
     * @desc Define an comportement/porperties at all save
     * @function pre
     */
    CarCategorySchema.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    var CarCategory = mongoose.model('CarCategory', CarCategorySchema, 'CarCategories');

    module.exports = CarCategory;
})();