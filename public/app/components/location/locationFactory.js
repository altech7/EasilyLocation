(function () {
    'use strict';
    angular
        .module('appEasilyLocation')
        .factory('LocationWebAPI', LocationWebAPI);

    LocationWebAPI.$inject = ['$http', '$q'];
    function LocationWebAPI($http, $q) {

        return {
            findAll: _findAllWithCarsAndAgencies,
            archive: _archive,
            cloture: _cloture,
            confirm: _confirm,
            create: _create,
            generateDevis: _generateDevis,
            generateFacture: _generateFacture,
            generatePrice: _generatePrice,
            findAllPrices: _findAllPrices,
            fromPricesToViewObject: _fromPricesToViewObject,
            updatePricesAppliedBy: _updatePricesAppliedBy
        };

        function _fromPricesToViewObject(prices) {
            var viewObject = {
                tourism: {
                    catOne: [],
                    catTwo: [],
                    catThree: [],
                    catFour: [],
                    catFive: [],
                    catSix: []
                },
                utility: {
                    catA: [],
                    catAPrime: [],
                    catB: [],
                    catC: [],
                    catD: [],
                    catE: []
                }
            };

            viewObject.tourism.catOne = _.filter(prices, function (item) {
                return item.category.category === '1';
            });

            viewObject.tourism.catTwo = _.filter(prices, function (item) {
                return item.category.category === '2';
            });

            viewObject.tourism.catThree = _.filter(prices, function (item) {
                return item.category.category === '3';
            });

            viewObject.tourism.catFour = _.filter(prices, function (item) {
                return item.category.category === '4';
            });

            viewObject.tourism.catFive = _.filter(prices, function (item) {
                return item.category.category === '5';
            });

            viewObject.tourism.catSix = _.filter(prices, function (item) {
                return item.category.category === '6';
            });


            viewObject.utility.catA = _.filter(prices, function (item) {
                return item.category.category === 'A';
            });

            viewObject.utility.catAPrime = _.filter(prices, function (item) {
                return item.category.category === 'A';
            });

            viewObject.utility.catB = _.filter(prices, function (item) {
                return item.category.category === 'B';
            });

            viewObject.utility.catC = _.filter(prices, function (item) {
                return item.category.category === 'C';
            });

            viewObject.utility.catD = _.filter(prices, function (item) {
                return item.category.category === 'D';
            });

            viewObject.utility.catE = _.filter(prices, function (item) {
                return item.category.category === 'E';
            });

            return viewObject;
        }

        function _findAllPrices() {
            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl(
                '/locations/findAllPrices'
            );
            var promise = $http(requestOptions);
            return promise.then(function (response) {
                var data = response.data;
                if (!data) {
                    throw new Error('data');
                }
                return data;
            });
        }

        function _generateDevis(client, location) {
            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl(
                '/client/' + client._id + '/location/' + location._id + '/quote'
            );
            var promise = $http(requestOptions);
            return promise.then(function (response) {
                var data = response.data;
                if (!data) {
                    throw new Error('data');
                }
                return data;
            });
        }

        function _generateFacture(client, location) {
            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl(
                '/client/' + client._id + '/location/' + location._id + '/bill'
            );
            var promise = $http(requestOptions);
            return promise.then(function (response) {
                var data = response.data;
                if (!data) {
                    throw new Error('data');
                }
                return data;
            });
        }

        function _generatePrice(duration, kms, categoryId) {
            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl(
                '/locations/generatePrice/' + duration + "/" + kms + "/" + categoryId
            );
            var promise = $http(requestOptions);
            return promise.then(function (response) {
                var data = response.data;
                if (!data) {
                    throw new Error('data');
                }
                return data;
            });
        }

        //Web API
        function _findAllWithCarsAndAgencies() {
            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl(
                '/locations/findAllWithCarsAndAgencies'
            );
            var promise = $http(requestOptions);
            return promise.then(function (response) {
                var data = response.data;
                if (!data) {
                    throw new Error('data');
                }
                var factory = neogenz.beans.factory;
                if (!_.isArray(data)) {
                    throw new Error('The result of promise must be an array');
                }

                return data;
            });
        }

        function _updatePricesAppliedBy(location, client, pricesApplied) {
            var requestOptions = neogenz.httpUtilities
                .buildPutRequestOptToCallThisUrl(
                '/locations/' + location._id + '/updatePricesApplied/client/' + client._id, pricesApplied
            );
            return $http(requestOptions);
        }

        function _archive(location, client) {
            if ((neogenz.utilities.isUndefinedOrNull(location._id) || location._id === '') &&
                ((neogenz.utilities.isUndefinedOrNull(client._id) || client._id === ''))) {
                return $q.reject();
            }
            var requestOptions = neogenz.httpUtilities.buildPutRequestOptToCallThisUrl('/locations/archive/' + location._id + '/client/' + client._id);
            return $http(requestOptions);
        }

        function _cloture(location, client, kms) {
            if ((neogenz.utilities.isUndefinedOrNull(location._id) || location._id === '') &&
                ((neogenz.utilities.isUndefinedOrNull(client._id) || client._id === ''))) {
                return $q.reject();
            }
            var requestOptions = neogenz.httpUtilities.buildPutRequestOptToCallThisUrl('/locations/cloture/' + location._id + '/kms/' + kms + '/client/' + client._id);
            return $http(requestOptions);
        }

        function _confirm(location, client) {
            if ((neogenz.utilities.isUndefinedOrNull(location._id) || location._id === '') &&
                ((neogenz.utilities.isUndefinedOrNull(client._id) || client._id === ''))) {
                return $q.reject();
            }
            var requestOptions = neogenz.httpUtilities.buildPutRequestOptToCallThisUrl('/locations/confirm/' + location._id + '/client/' + client._id);
            return $http(requestOptions);
        }

        function _create(location) {
            if (neogenz.utilities.isUndefinedOrNull(location.client) || location.client === '') {
                return $q.reject();
            }
            var def = $q.defer();
            var bodyReq = location;
            var promise;
            if (!neogenz.utilities.isUndefinedOrNull(bodyReq)) {
                var requestOptions = neogenz.httpUtilities.buildPutRequestOptToCallThisUrl('/locations/addComingLocationToClient/' + location.client, bodyReq);
                promise = $http(requestOptions);
                promise.success(function (rawCreated) {
                    var created = neogenz.beans.factory.getBean('Client', rawCreated);
                    def.resolve(created);
                }).error(function () {
                    def.reject();
                });
            }
            else {
                def.reject('bodyReq is null or undefined.');
            }
            return def.promise;
        }
    }

})();