(function init() {
    'use strict';

    neogenz.utilities.defineNamespace(easilyLocation, 'config');
    neogenz.utilities.defineNamespace(easilyLocation, 'endpoints');

    easilyLocation.config.webApi = (function () {
        var _subdomain = 'easilylocation',
            _domain = 'localhost',
            _port = '3000', //80
            _protocol = 'http',
            _baseUrl = _protocol + '://' + _domain;
        return {
            subdomain: _subdomain,
            domain: _domain,
            port: _port, //80
            protocol: _protocol,
            baseUrl: _baseUrl
        };
    })();

    easilyLocation.endpoints = {
        nodeEndpoint: easilyLocation.config.webApi.protocol + '://' +
        easilyLocation.config.webApi.domain + ':' +
        easilyLocation.config.webApi.port
    };
})();