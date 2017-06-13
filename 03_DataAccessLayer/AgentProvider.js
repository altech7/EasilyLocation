'use strict';

(function init() {
    var Agence = require('../04_Models/Agence');
    var jwt = require('jsonwebtoken');

    function AgentProvider() {
    }

    AgentProvider.prototype.findByLoginAndPassword = function (login, password) {
        return Agence.findOne({'agent.login': login}).select('agent').exec().then(function (agence) {
            if (!agence) {
                var err = ({
                    statusHttp: 404,
                    message: 'User not found.'
                });
                throw err;
            }
            if (!agence.agent.validPassword(password)) {
                var err = ({
                    statusHttp: 404,
                    message: 'Invalid password.'
                });
                return err;
            }
            return agence.agent;
        });
    };

    AgentProvider.prototype.signinByLoginAndPassword = function (login, password) {
        return this.findByLoginAndPassword(login, password).then(function (agentFinded) {

            var token = jwt.sign(agentFinded.toObject(), process.env.JWT_SECRET, {
                expiresIn: "86400000" // expires in 24 hours
            });
            return token;
        });
    };

    module.exports = new AgentProvider();
})();