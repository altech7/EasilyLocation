'use strict';

(function init() {
    var bcrypt = require('bcrypt-nodejs');
    var mongoose = require('mongoose');
    var Agent = require('./Agent');
    var Location = require('./Location');
    var Schema = mongoose.Schema;
    var AgenceSchema = new Schema({
        name : String,
        updatedAt: Date,
        createdAt: Date,
        place : String,
        agent: Agent.schema
    });

    // on every save, add the date
    AgenceSchema.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    var Agence = mongoose.model('Agence', AgenceSchema, 'Agences');

    module.exports = Agence;

})();