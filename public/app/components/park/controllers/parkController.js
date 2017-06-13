/**
 * @desc Controllers of BudgetManager
 * @namespace Controllers
 */
(function () {
    'use strict';

    angular
        .module('appEasilyLocation')
        .controller('ParkController', ParkController);

    ParkController.$inject = ['$localStorage', '$timeout', 'ParkWebAPI', 'AgencyWebAPI', '$state', '$scope', '$uibModal', 'park', 'toastr'];

    /**
     * @desc Controllers of ProvisionalPlans
     * @namespace HomeController
     * @memberOf Controllers
     */
    function ParkController($localStorage, $timeout, ParkWebAPI, AgencyWebAPI, $state, $scope, $uibModal, park, toastr) {

        (function init() {
            defineScope();
            defineListeners();
        })();

        /**
         * @desc Defines all $scope variables
         * @function defineScope
         */
        function defineScope() {
            $scope.park = _getParkDTO(park);
            $scope.confirmationMessage = 'Êtes vous sur de vouloir désactiver cette voiture ?';
        }

        /**
         * @desc Attach view listeners to this controller
         * @function defineListeners
         */
        function defineListeners() {
            $scope.filterByCarTypeListener = _filterByCarType;
            $scope.findAll = _findAll;
            $scope.deleteClickListener = _deleteThisCar;
            $scope.addClickListener = _openModalForCreateCar;
        }

        function _filterByCarType(type) {
            ParkWebAPI.findAll().then(function (park) {
                    _.defer(function () {
                        $scope.$apply(function () {
                            $scope.park = _getParkDTO(park);
                            $scope.park = _.reject($scope.park, function (item) {
                                return item.car.category.type !== type;
                            });
                            toastr.info('Liste des véhicules de type : ' + type, '');
                        });
                    });
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }

        function _findAll() {
            ParkWebAPI.findAll().then(function (park) {
                    _.defer(function () {
                        $scope.$apply(function () {
                            $scope.park = _getParkDTO(park);
                        });
                        toastr.info('Liste de tous les véhicules', '');
                    });
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }

        function _getParkDTO(park) {

            park.forEach(function (item) {
                if (item.availableDate) {
                    item.availableDate = moment(item.availableDate).format('DD/MM/YYYY');
                }

                if (item.car.category.audio) {
                    var audio = "";
                    for (var i = 0; i < item.car.category.audio.length; i++) {
                        console.log(item.car.category.audio[i]);
                        if (i > 0)
                            audio = audio + ", " + item.car.category.audio[i];
                        else
                            audio = audio + " " + item.car.category.audio[i];
                    }
                    item.car.category.audio = audio;
                }
                if (item.car.category.engine) {
                    var engine = "";
                    for (var i = 0; i < item.car.category.engine.length; i++) {
                        console.log(item.car.category.engine[i]);
                        if (i > 0)
                            engine = engine + ", " + item.car.category.engine[i];
                        else
                            engine = engine + " " + item.car.category.engine[i];
                    }
                    item.car.category.engine = engine;
                }

                if (item.car.category.type == 'Tourisme') {
                    if (item.car.category.numberOfDoors) {
                        var numberOfDoors = "";
                        for (var i = 0; i < item.car.category.numberOfDoors.length; i++) {
                            if (i > 0)
                                numberOfDoors = numberOfDoors.substring(0, 2) + " ou " + item.car.category.numberOfDoors[i] + " portes";
                            else
                                numberOfDoors = numberOfDoors + " " + item.car.category.numberOfDoors[i] + " portes";
                        }
                        item.car.category.numberOfDoors = numberOfDoors;
                    }

                    if (item.car.category.airConditioner) {
                        var str = "";
                        if (item.car.category.other) {
                            str = "Climatisation : Oui - Autres : " + item.car.category.other;
                        }
                        item.car.category.climAndOther = str;
                    }

                }

                if (item.car.category.type === 'Utilitaire') {
                    if (item.car.category.nbLateralDoors) {
                        var nbLateralDoors = "";
                        for (var i = 0; i < item.car.category.nbLateralDoors.length; i++) {
                            if (i > 0)
                                nbLateralDoors = nbLateralDoors.substring(0, 2) + " ou " + item.car.category.nbLateralDoors[i] + " porte(s)";
                            else
                                nbLateralDoors = nbLateralDoors + " " + item.car.category.nbLateralDoors[i] + " porte(s)";
                        }
                        item.car.category.nbLateralDoors = nbLateralDoors;
                    }

                    if (item.car.category.powerSteering) {
                        var str = "";
                        if (item.car.category.powerSteering[0] === 'Oui') {
                            str = 'Oui';
                        } else {
                            str = 'Non';
                        }
                        item.car.category.powerSteering = str;
                    }
                }
            });
            return park;
        }

        function _deleteThisCar(car) {
            function buildConfirmActionModalOpts(confirmationMessage) {
                return {
                    templateUrl: 'app/shared/confirmAction/actionConfirmView.html', // Url du template HTML
                    controller: 'actionConfirmController',
                    resolve: {
                        confirmationMessage: function () {
                            return confirmationMessage;
                        }
                    }
                };
            }

            var modalInstance = $uibModal.open(buildConfirmActionModalOpts($scope.confirmationMessage));
            modalInstance.result.then(function () {
                _remove(car);
                toastr.success('Voiture désactivée avec succès', '');
            }, function () {
                console.log('Suppression du véhicule annulé.');
            });
        }

        function _openModalForCreateCar() {
            function openModal() {
                var _clientModalFormOpts = {
                    templateUrl: 'app/components/park/views/form.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.car = null;
                        $scope.icon = 'fa fa-plus';
                        $scope.action = 'Ajouter';
                        AgencyWebAPI.findAll().then(function (agencies) {
                            $scope.agencies = agencies;
                        });

                        ParkWebAPI.findAllCategories().then(function (categories) {
                            var categoriesTourism = [], categoriesUtility = [];
                            categories.data.forEach(function (cat) {
                                if (cat.type == 'Tourisme') {
                                    categoriesTourism.push(cat);
                                }
                                if (cat.type == 'Utilitaire') {
                                    categoriesUtility.push(cat);
                                }
                            });
                            $scope.categoriesTourism = categoriesTourism;
                            $scope.categoriesUtility = categoriesUtility;
                        });

                        $scope.ok = function () {
                            return $uibModalInstance.close($scope.car);
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('Création du client annulé');
                        };
                    }
                };
                var modalInstance = $uibModal.open(_clientModalFormOpts);

                modalInstance.result.then(function (car) {
                    _create(car);
                    toastr.success('Voiture créée avec succès', '');
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }

            openModal();
        }

        function _remove(car) {
            ParkWebAPI.remove(car).then(function () {
                    $state.go('park');
                    $state.reload();
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }

        function _create(car) {
            ParkWebAPI.create(car).then(function () {
                    $state.go('park');
                    $state.reload();
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }
    }

})();