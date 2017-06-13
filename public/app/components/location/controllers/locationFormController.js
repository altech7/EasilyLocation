(function () {
    'use strict';

    angular
        .module('appEasilyLocation')
        .controller('LocationFormController', LocationFormController);

    LocationFormController.$inject = ['$scope', '$uibModalInstance', 'WizardHandler', 'ParkWebAPI', 'ClientWebAPI', 'AgencyWebAPI', 'LocationWebAPI'];

    /**
     * @class LocationFormController
     */
    function LocationFormController($scope, $uibModalInstance, WizardHandler, ParkWebAPI, ClientWebAPI, AgencyWebAPI, LocationWebAPI) {

        (function init() {
            defineScope();
            defineListeners();
        })();


        /**
         * @desc Defines all $scope/$scope variables
         * @function defineScope
         */
        function defineScope() {
            ClientWebAPI.findAll().then(function (clients) {
                $scope.clients = clients;
            });
            AgencyWebAPI.findAll().then(function (agencies) {
                $scope.agencies = agencies;
            });
            $scope.locationFormModel = {
                client: null,
                startAgency: null,
                endAgency: null,
                startDate: moment().toDate(),
                endDate: moment().add(2, 'd').toDate(),
                kms: null,
                car: null,
                hoursStart: null,
                hoursEnd: null,
                price: null
            };
            $scope.steps = {
                ONE: 1,
                TWO: 2,
                THREE: 3,
                FOUR: 4,
                FIVE: 5
            };
            $scope.startDateProperties = {
                minDate: new Date(),
                maxDate: $scope.locationFormModel.endDate
                //maxDate: new Date()
            };
            $scope.endDateProperties = {
                minDate: moment().add(1, 'd').toDate()
            };
            $scope.carsAvailable = null;

            $scope.ok = function () {
                return $uibModalInstance.close($scope.locationFormModel);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('Création de la location annulée');
            };
        }


        /**
         * @desc Attach view listeners to this controller
         * @function defineListeners
         */
        function defineListeners() {
            $scope.nextStep = _nextStep;
            $scope.previousStep = _previousStep;
            $scope.refreshStartDateRange = _refreshStartDateRange;
            $scope.refreshEndDateRange = _refreshEndDateRange;
            $scope.getTypeBy = _getTypeBy;
        }
        
        function _getTypeBy(car) {
            var carCategory = _.findWhere($scope.carCategories, {id: car.category});
            return carCategory;
        }


        function _refreshStartDateRange() {
            $scope.startDateProperties.maxDate = moment($scope.locationFormModel.endDate).subtract(1, 'd').toDate();

        }


        function _refreshEndDateRange() {
            $scope.endDateProperties.minDate = moment($scope.locationFormModel.startDate).add(1, 'd').toDate();
        }


        function _nextStep() {
            var currentStep = WizardHandler.wizard().currentStepNumber();
            switch (currentStep) {
                case $scope.steps.ONE:
                    ParkWebAPI.findAllAvailableByAgency($scope.locationFormModel.startAgency, $scope.locationFormModel.startDate, $scope.locationFormModel.endDate).then(function (carsAvailable) {
                        var carsTourism = [], carsUtility = [];
                        carsAvailable.immediatelyAvailableCars.forEach(function (car) {
                            if (car.category.type == 'Tourisme') {
                                carsTourism.push(car);
                            }
                            if (car.category.type == 'Utilitaire') {
                                carsUtility.push(car);
                            }
                        });
                        $scope.carsTourism = carsTourism;
                        $scope.carsUtility = carsUtility;

                        var carsComing = [];
                        carsAvailable.comingAvailableCars.forEach(function (item) {
                            carsComing.push(item);
                        });
                        $scope.carsComing = carsComing;
                    });

                    WizardHandler.wizard().next();
                    break;
                case $scope.steps.TWO:
                    var a = moment($scope.locationFormModel.endDate);
                    var b = moment($scope.locationFormModel.startDate);
                    var duration = a.diff(b, 'days');
                    var carId = $scope.locationFormModel.car;

                    LocationWebAPI.generatePrice(duration, $scope.locationFormModel.kms, carId).then(function (item) {
                        $scope.price = item.price;
                        $scope.locationFormModel.price = item.price;
                    });

                    WizardHandler.wizard().next();
                    break;
                case $scope.steps.THREE:
                    WizardHandler.wizard().next();
                    break;
                case $scope.steps.FOUR:
                    WizardHandler.wizard().next();
                    break;
                case $scope.steps.FIVE:
                    WizardHandler.wizard().next();
                    break;
            }
        }


        function _previousStep() {
            var currentStep = WizardHandler.wizard().currentStepNumber();
            switch (currentStep) {
                case $scope.steps.TWO:
                    WizardHandler.wizard().previous();
                    break;
                case $scope.steps.THREE:
                    WizardHandler.wizard().previous();
                    break;
                case $scope.steps.FOUR:
                    WizardHandler.wizard().previous();
                    break;
                case $scope.steps.FIVE:
                    WizardHandler.wizard().previous();
                    break;
            }
        }
    }

})();