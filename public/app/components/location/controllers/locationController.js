/**
 * @desc Controllers of BudgetManager
 * @namespace Controllers
 */
(function () {
    'use strict';

    angular
        .module('appEasilyLocation')
        .controller('LocationController', LocationController);

    LocationController.$inject = ['$localStorage', 'LocationWebAPI', '$state', '$scope', '$uibModal', 'clients', 'toastr'];

    /**
     * @desc Controllers of ProvisionalPlans
     * @namespace HomeController
     * @memberOf Controllers
     */
    function LocationController($localStorage, LocationWebAPI, $state, $scope, $uibModal, clients, toastr) {

        (function init() {
            defineScope();
            defineListeners();
        })();

        /**
         * @desc Defines all $scope variables
         * @function defineScope
         */
        function defineScope() {
            $scope.locationsDTO = _getLocationsDTO();
            $scope.confirmationMessageArchive = 'Êtes vous sur de vouloir archiver cette location ?';
            $scope.confirmationMessageCloture = 'Êtes vous sur de vouloir clotûrer cette location ?';
            $scope.confirmationMessageConfirm = 'Êtes vous sur de vouloir passer le statut de cette location à "en cours" ?';
        }

        /**
         * @desc Attach view listeners to this controller
         * @function defineListeners
         */
        function defineListeners() {
            $scope.archiveListener = _archiveLocation;
            $scope.clotureListener = _clotureLocation;
            $scope.confirmListener = _confirmLocation;
            $scope.addClickListener = _openModalForCreateLocation;
            $scope.addClickListenerForGeneratePrice = _openPriceGeneratorModal;
            $scope.generateDevisListener = _generateDevis;
            $scope.generateFactureListener = _generateFacture;
        }

        function _openModalForCreateLocation() {
            function openModal() {
                var _locationModalFormOpts = {
                    templateUrl: 'app/components/location/views/form.html',
                    controller: 'LocationFormController'
                };
                var modalInstance = $uibModal.open(_locationModalFormOpts);
                modalInstance.result.then(function (location) {
                    _create(location);
                    toastr.success('Location créée avec succès', '');
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }

            openModal();
        }

        function _openPriceGeneratorModal(client, location) {

            function openModal() {
                var _addModalOpts = {
                    template: '<price-generator-cmp on-cancel="modalCtrl.cancel()" on-finish="modalCtrl.finish($pricesToApply)" prices="modalCtrl.prices"></price-generator-cmp>',
                    controller: function ($scope, $uibModalInstance, prices) {
                        var modalVm = this;
                        modalVm.prices = prices;
                        modalVm.finish = function (pricesToApply) {
                            $uibModalInstance.close(pricesToApply);
                        };
                        modalVm.cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    },
                    controllerAs: 'modalCtrl',
                    resolve: {
                        prices: function (LocationWebAPI) {
                            return LocationWebAPI.findAllPrices();
                        }
                    }
                };
                var modalInstance = $uibModal.open(_addModalOpts);

                modalInstance.result.then(function (pricesToApply) {
                    LocationWebAPI.updatePricesAppliedBy(client, location, pricesToApply).then(function (clientSaved) {
                        toastr.success('Prix mis à jour.', 'Ajouté !');
                        $state.go('locations');
                        $state.reload();
                    }).catch(function (err) {
                        toastr.error(err.message);
                    });
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                })
                    .catch(function (reason) {
                        throw new Error(reason);
                    });
            }

            openModal();
        }

        function _archiveLocation(location, client) {
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

            var modalInstance = $uibModal.open(buildConfirmActionModalOpts($scope.confirmationMessageArchive));
            modalInstance.result.then(function () {
                _archive(location, client);
                toastr.success('Location archivée avec succès', '');
            }, function () {
                console.log('Archive annulée.');
            });
        }

        function _clotureLocation(location, client) {
            function buildConfirmActionModalOpts(confirmationMessage) {
                return {
                    templateUrl: 'app/components/location/views/cloture.html', // Url du template HTML
                    controller: function ($scope, $uibModalInstance) {
                        $scope.kms = null;
                        $scope.action = 'Cloturer';
                        $scope.ok = function () {
                            return $uibModalInstance.close($scope.kms);
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('Cloture de cette location annulée');
                        };
                    }
                };
            }

            var modalInstance = $uibModal.open(buildConfirmActionModalOpts($scope.confirmationMessageCloture));
            modalInstance.result.then(function (kms) {
                _cloture(location, client, kms);
                toastr.success('Location cloturée avec succès', '');
            }, function () {
                console.log('Cloture annulée.');
            });
        }


        function _confirmLocation(location, client) {
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

            var modalInstance = $uibModal.open(buildConfirmActionModalOpts($scope.confirmationMessageConfirm));
            modalInstance.result.then(function () {
                _confirm(location, client);
            }, function () {
                console.log('Confirmation annulée.');
            });
        }

        function _getLocationsDTO() {
            var models = [];
            clients.forEach(function (client) {
                client.closedLocations.forEach(function (loc) {
                    var model = {};
                    var clt = new Object({
                        _id: client._id,
                        lastName: client.lastName,
                        firstName: client.firstName
                    });
                    var a = moment(loc.dateEnd);
                    var b = moment(loc.dateStart);
                    loc.duration = a.diff(b, 'days') + " jours";
                    var location = new Object({
                        state: 'Fermée',
                        location: loc
                    });
                    model.client = clt;
                    model.location = location;
                    models.push(model);
                });

                client.currentLocations.forEach(function (loc) {
                    var model = {};
                    var clt = new Object({
                        _id: client._id,
                        lastName: client.lastName,
                        firstName: client.firstName
                    });
                    var a = moment(loc.dateEnd);
                    var b = moment(loc.dateStart);
                    loc.duration = a.diff(b, 'days') + " jours";
                    var location = new Object({
                        state: 'En cours',
                        location: loc
                    });
                    model.client = clt;
                    model.location = location;
                    models.push(model);
                });

                client.comingLocations.forEach(function (loc) {
                    var model = {};
                    var clt = new Object({
                        _id: client._id,
                        lastName: client.lastName,
                        firstName: client.firstName
                    });
                    var a = moment(loc.dateEnd);
                    var b = moment(loc.dateStart);
                    loc.duration = a.diff(b, 'days') + " jours";
                    var location = new Object({
                        state: 'À venir',
                        location: loc
                    });
                    model.client = clt;
                    model.location = location;
                    models.push(model);
                });

            });

            return models;
        }

        function _generateDevis(client, location) {
            LocationWebAPI.generateDevis(client, location).then(function (url) {
                console.log(url);
                window.open(url);
            });
        }

        function _generateFacture(client, location) {
            LocationWebAPI.generateFacture(client, location).then(function (url) {
                console.log(url);
                window.open(url);
            });
        }

        function _archive(location, client) {
            LocationWebAPI.archive(location, client).then(function () {
                    setTimeout(function () {
                        $state.go('locations');
                        $state.reload();
                    }, 200);
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }

        function _cloture(location, client, kms) {
            LocationWebAPI.cloture(location, client, kms).then(function () {
                    $state.go('locations');
                    $state.reload();
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }

        function _confirm(location, client) {
            LocationWebAPI.confirm(location, client).then(function () {
                    $state.go('locations');
                    $state.reload();
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }

        function _create(location) {
            LocationWebAPI.create(location).then(function () {
                    $state.go('locations');
                    $state.reload();
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }

    }
})();