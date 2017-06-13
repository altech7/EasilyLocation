'use strict';

(function init() {
    var bcrypt = require('bcrypt-nodejs');
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var AgentSchema = new Schema({
        login : {type: String, required: true, unique: true},
        password : {type: String, required: true},
        updatedAt : Date,
        createdAt : Date
    });

    // on every save, add the date
    AgentSchema.pre('save', function (next) {
        // get the current date
        var currentDate = new Date();

        // change the updated_at field to current date
        this.updatedAt = currentDate;

        // if created_at doesn't exist, add to that field
        if (!this.createdAt)
            this.createdAt = currentDate;

        next();
    });

    AgentSchema.methods.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    AgentSchema.methods.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };


    var Agent = mongoose.model('Agent', AgentSchema, 'Agents');

    module.exports = Agent;
})();