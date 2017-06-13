'use strict';

(function init() {
    var Agence = require('../04_Models/Agence');
    var Agent = require('../04_Models/Agent');
    var agenciesJson = require('../x/json/agencies.json');

    function AgenceProvider() {
    }

    AgenceProvider.prototype.findAll = function () {
        return Agence
            .find();
    };

    AgenceProvider.prototype.findById = function (id, callback) {
        Agence
            .findById(id)
            .exec(function (err, agenceFinded) {
                callback(err, agenceFinded);
            });
    };


    AgenceProvider.prototype.initAllDefaultAgencies =
        function _initAllDefaultAgencies() {
            var agences = new Array();
            for (var key in agenciesJson) {
                var AgenceToSave = new Agence();
                var AgentToSave = new Agent();
                AgenceToSave.agent = agenciesJson[key].agent;
                AgentToSave.login = agenciesJson[key].agent.login;
                AgentToSave.password = AgentToSave.generateHash(agenciesJson[key].agent.password);
                AgenceToSave.agent = AgentToSave;
                AgenceToSave.locations = agenciesJson[key].locations;
                AgenceToSave.name = agenciesJson[key].name;
                AgenceToSave.place = agenciesJson[key].place;
                agences.push(AgenceToSave);
            }
            return Agence.create(agences);
        };

    module.exports = new AgenceProvider();
})();