'use strict';

function init(provider) {

    var authenticationHelpers = require('../01_Commons/authenticationHelpers');
    var agencyProvider = require('../03_DataAccessLayer/AgenceProvider');

    var _findAll = function (req, res) {
        agencyProvider.findAll().then(function (agencies) {
            res.send(agencies);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    provider.get("/agencies/findAll", authenticationHelpers.ensureAuthorized, _findAll);

    provider.get("/api/android/agencies/findAll", _findAll);
};

module.exports = init;