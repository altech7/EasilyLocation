"use strict";
(function init() {
    var mongoose = require('mongoose');
    var Location = require('../04_Models/Location');
    var Client = require('../04_Models/Client');
    var Schema = mongoose.Schema;
    var ArchiveSchema = new Schema({
        client: Client.schema,
        locations: {type: [Location.schema], default: []},
        updatedAt : Date,
        createdAt : Date
    });

    /**
     * @desc Define an comportement/porperties at all save
     * @function pre
     */
    ArchiveSchema.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    var Archive = mongoose.model('Archive', ArchiveSchema, 'Archives');

    module.exports = Archive;
})();