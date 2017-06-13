'use strict';

function init(provider) {

    var authenticationHelpers = require('../01_Commons/authenticationHelpers');
    var clientProvider = require('../03_DataAccessLayer/ClientProvider');

    var _create = function (req, res) {
        clientProvider.create(req.body).then(function (client) {
            res.send(client);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _update = function (req, res) {
        clientProvider.update(req.params.id, req.body).then(function (client) {
            res.send(client);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    var _delete = function (req, res) {
        clientProvider.delete(req.params.id).then(function (client) {
            res.send(client);
        });
        res.status(200);
    };

    var _findAll = function (req, res) {
        clientProvider.findAll().then(function (clients) {
            res.send(clients);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    provider.get("/clients/findAll", authenticationHelpers.ensureAuthorized, _findAll);
    provider.delete("/clients/delete/:id", authenticationHelpers.ensureAuthorized, _delete);
    provider.post("/clients/create", authenticationHelpers.ensureAuthorized, _create);
    provider.put("/clients/update/:id", authenticationHelpers.ensureAuthorized, _update);
};

module.exports = init;