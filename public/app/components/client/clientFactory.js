(function () {
    'use strict';
    angular
        .module('appEasilyLocation')
        .factory('ClientWebAPI', ClientWebAPI);

    ClientWebAPI.$inject = ['$http', '$q'];
    function ClientWebAPI($http, $q) {

        return {
            findAll: _findAll,
            remove: _remove,
            create: _create,
            update: _update
        };

        //Web API
        function _findAll() {
            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl(
                '/clients/findAll'
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
                var clients = [];
                for (var i = 0; i < data.length; i++) {
                    clients.push(factory.getBean('Client', data[i]));
                }
                return data;
            });
        }

        function _remove(client) {
            if (neogenz.utilities.isUndefinedOrNull(client._id) || client._id === '') {
                return $q.reject();
            }
            var requestOptions = neogenz.httpUtilities.buildDeleteRequestOptToCallThisUrl('/clients/delete/' + client._id);
            return $http(requestOptions);
        }

        function _create(client) {
            var def = $q.defer();
            var bodyReq = client;
            var promise;
            if (!neogenz.utilities.isUndefinedOrNull(bodyReq)) {
                var requestOptions = neogenz.httpUtilities.buildPostRequestOptToCallThisUrl('/clients/create/', bodyReq);
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

        function _update(client) {
            if (neogenz.utilities.isUndefinedOrNull(client._id) || client._id === '') {
                return $q.reject();
            }
            var def = $q.defer();
            var bodyReq = client;
            var promise;
            if (!neogenz.utilities.isUndefinedOrNull(bodyReq)) {
                var requestOptions = neogenz.httpUtilities.buildPutRequestOptToCallThisUrl('/clients/update/' + client._id, bodyReq);
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