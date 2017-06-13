'use strict';

/**
 * Déclaration de l'application appEasilyLocation
 */
angular
    .module('appEasilyLocation',
    [
        'ui.router',
        'ui.bootstrap',
        'angular-loading-bar',
        'ngAnimate',
        'ngStorage',
        'toastr',
        'mgo-angular-wizard',
        'ngMaterial'
    ]
);

angular
    .module('appEasilyLocation')
    .run(function ($localStorage, $state, $rootScope) {
        $rootScope.devise = '€';
    });

angular
    .module('appEasilyLocation')
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if (!neogenz.utilities.isUndefinedOrNull($localStorage.token)) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function (response) {
                    if (response.status === 401) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    });