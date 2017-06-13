'use strict';

function init(provider) {
    var pdfGeneratorHelpers = require('../01_Commons/pdfGeneratorHelpers'),
        authenticationHelper = require('../01_Commons/authenticationHelpers');

    function _generateQuoteBy(req, res) {
        var clientId = req.params.clientId,
            locationId = req.params.locationId;

        pdfGeneratorHelpers.generateQuoteBy(clientId, locationId).then(function (url) {
            res.status(200).send(url);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    }

    function _generateBillBy(req, res) {
        var clientId = req.params.clientId,
            locationId = req.params.locationId;

        pdfGeneratorHelpers.generateBillBy(clientId, locationId).then(function (url) {
            res.status(200).send(url);
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    }

    provider.get('/client/:clientId/location/:locationId/quote', _generateQuoteBy);
    provider.get('/client/:clientId/location/:locationId/bill', _generateBillBy);
};

module.exports = init;