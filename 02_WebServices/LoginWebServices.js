'use strict';

function init(provider) {

    var authenticationHelpers = require('../01_Commons/authenticationHelpers');
    var agentProvider = require('../03_DataAccessLayer/AgentProvider');

    var _signin = function (req, res) {
        agentProvider.signinByLoginAndPassword(req.body.login, req.body.password).then(function (token) {
            res.send({token: token});
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };

    provider.post("/signin", _signin);
};

module.exports = init;