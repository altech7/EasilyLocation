(function () {
    'use strict';
    angular
        .module('appEasilyLocation')
        .factory('ParkWebAPI', ParkWebAPI);

    ParkWebAPI.$inject = ['$http', '$q'];
    function ParkWebAPI($http, $q) {

        return {
            findAll: _findAllAvailableCarAtNowAndComing,
            findAllByCarType: _findAllWithCategoryByCarType,
            findAllCategories: _findAllCategories,
            findAllAvailableByAgency : _findAllAvailableByAgency,
            remove: _remove,
            create: _create
        };

        //Web API
        function _findAllAvailableCarAtNowAndComing() {
            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl(
                '/park/findAllAvailableCarAtNowAndComing'
            );
            var promise = $http(requestOptions);
            return promise.then(function (response) {
                var data = response.data;
                if (!data) {
                    throw new Error('data');
                }
                if (!_.isArray(data)) {
                    throw new Error('The result of promise must be an array');
                }
                return data;
            });
        }

        function _findAllAvailableByAgency(id, start, end) {
            var dateStart = moment(start).format('DD-MM-YYYY');
            var dateEnd = moment(end).format('DD-MM-YYYY');

            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl(
                '/park/findAllAvailableByAgency/' + id + '/betweenDates/' + dateStart + '/' + dateEnd
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

        function _findAllWithCategoryByCarType(carType) {
            if (neogenz.utilities.isUndefinedOrNull(carType) || carType === '') {
                return $q.reject();
            }
            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl(
                '/park/findAllByCarType/' + carType
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
                var park = [];
                for (var i = 0; i < data.length; i++) {
                    park.push(factory.getBean('Car', data[i]));
                }
                return park;
            });
        }

        function _findAllCategories() {
            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl('/park/findAllCategories');
            return $http(requestOptions);
        }

        function _remove(car) {
            if (neogenz.utilities.isUndefinedOrNull(car._id) || car._id === '') {
                return $q.reject();
            }
            var requestOptions = neogenz.httpUtilities.buildPutRequestOptToCallThisUrl('/park/updateForDisabled/' + car._id);
            return $http(requestOptions);
        }

        function _create(car) {
            var def = $q.defer();
            var bodyReq = car;
            var promise;
            if (!neogenz.utilities.isUndefinedOrNull(bodyReq)) {
                var requestOptions = neogenz.httpUtilities.buildPostRequestOptToCallThisUrl('/park/create/', bodyReq);
                promise = $http(requestOptions);
                promise.success(function (rawCreated) {
                    var created = neogenz.beans.factory.getBean('CarWithId', rawCreated);
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