(function () {
    'use strict';

    var isAuthenticated = function ($rootScope, $q, $http, $state, toastr) {
        var defer = $q.defer();
        $http.get('/isAuthenticated').then(
            function (response) {
                // Authenticated
                if (response.status !== undefined && response.status !== 200) {
                    console.log(response.data);
                    $state.go('login');
                } else {
                    $rootScope.user = response.data;
                    defer.resolve(true);
                }
            }, function () {
                $state.go('login');
            });
        return defer.promise;
    };

    angular
        .module('appEasilyLocation')
        .config(RoutingInitialization);
    RoutingInitialization.$intject = ['$stateProvider', '$urlRouterProvider'];

    function RoutingInitialization($stateProvider, $urlRouterProvider) {
        // Routing State System
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/components/home/home.html',
                controller: 'HomeController',
                resolve: ['$stateParams', '$state', function ($stateParams, $state) {
                }]
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/components/authentication/views/signin.html',
                controller: 'SigninController'
            })
            .state('clients', {
                url: '/clients',
                templateUrl: 'app/components/client/views/list.html',
                controller: 'ClientController',
                resolve: {
                    clients: function ($stateParams, ClientWebAPI) {
                        try {
                            return ClientWebAPI.findAll();
                        } catch (err) {
                            throw new Error(err);
                        }
                    },
                    user: isAuthenticated
                }
            })
            .state('locations', {
                url: '/locations',
                templateUrl: 'app/components/location/views/list.html',
                controller: 'LocationController',
                resolve: {
                    clients: function ($stateParams, LocationWebAPI) {
                        try {
                            return LocationWebAPI.findAll();
                        } catch (err) {
                            throw new Error(err);
                        }
                    },
                    user: isAuthenticated
                }
            })
            .state('park', {
                url: '/park',
                templateUrl: 'app/components/park/views/list.html',
                controller: 'ParkController',
                resolve: {
                    park: function ($stateParams, ParkWebAPI) {
                        try {
                            return ParkWebAPI.findAll();
                        } catch (err) {
                            throw new Error(err);
                        }
                    },
                    user: isAuthenticated
                }
            });

        $urlRouterProvider.otherwise('/');
    }
})();