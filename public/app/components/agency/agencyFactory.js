(function () {
    'use strict';
    angular
        .module('appEasilyLocation')
        .factory('AgencyWebAPI', AgencyWebAPI);

    AgencyWebAPI.$inject = ['$http', '$q'];
    function AgencyWebAPI($http, $q) {

        return {
            findAll: _findAll
        };

        //Web API
        function _findAll() {
            var requestOptions = neogenz.httpUtilities.buildGetRequestOptToCallThisUrl(
                '/agencies/findAll'
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
                var agencies = [];
                for (var i = 0; i < data.length; i++) {
                    agencies.push(factory.getBean('Agence', data[i]));
                }
                return agencies;
            });
        }

    }

})();