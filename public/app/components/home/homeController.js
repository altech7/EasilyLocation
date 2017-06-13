/**
 * @desc Controllers of BudgetManager
 * @namespace Controllers
 */
(function () {
    'use strict';

    angular
        .module('appEasilyLocation')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$localStorage', '$state', '$scope'];

    /**
     * @desc Controllers of ProvisionalPlans
     * @namespace HomeController
     * @memberOf Controllers
     */
    function HomeController($localStorage, $state, $scope) {
        (function init() {
            _redirectToClientListIfUserAuthenticated();
            defineScope();
            defineListeners();
        })();

        /**
         * @desc Defines all $scope variables
         * @function defineScope
         */
        function defineScope() {
        }

        /**
         * @desc Attach view listeners to this controller
         * @function defineListeners
         */
        function defineListeners() {
        }

        function _redirectToClientListIfUserAuthenticated() {
            if (!_.isUndefined($localStorage.token) && !_.isNull($localStorage.token) && !_.isEmpty($localStorage.token)) {
                debugger;
                $state.go('clients');
            }
        }
    }
})();