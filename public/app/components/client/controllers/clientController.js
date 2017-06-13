/**
 * @desc Controllers of BudgetManager
 * @namespace Controllers
 */
(function () {
    'use strict';

    angular
        .module('appEasilyLocation')
        .controller('ClientController', ClientController);

    ClientController.$inject = ['$localStorage', 'ClientWebAPI', '$state', '$scope', '$uibModal', 'clients', 'toastr'];

    /**
     * @desc Controllers of ProvisionalPlans
     * @namespace HomeController
     * @memberOf Controllers
     */
    function ClientController($localStorage, ClientWebAPI, $state, $scope, $uibModal, clients, toastr) {

        (function init() {
            defineScope();
            defineListeners();
        })();

        /**
         * @desc Defines all $scope variables
         * @function defineScope
         */
        function defineScope() {
            $scope.clients = clients;
            $scope.confirmationMessage = 'Êtes vous sur de vouloir supprimer ce client ?';
        }

        /**
         * @desc Attach view listeners to this controller
         * @function defineListeners
         */
        function defineListeners() {
            $scope.deleteClickListener = _deleteThisClient;
            $scope.addClickListener = _openModalForCreateClient;
            $scope.editClickListener = _openModalForEditClient;
            $scope.showHistoryListener = _showHistory;
        }

        function _deleteThisClient(client) {
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
                _remove(client);
                toastr.success('Le Client : ' + client.lastName + " " + client.firstName + " a été supprimé avec succès");
            }, function () {
                console.log('Suppression annulée.');
            });
        }

        function _showHistory(closedLocations) {
            function buildHistoryModalOpts(closedLocations) {
                return {
                    templateUrl: 'app/components/client/views/history.html', // Url du template HTML
                    controller: function ($uibModalInstance, $scope, closedLocations) {
                        $scope.closedLocations = closedLocations;
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('');
                        };
                    },
                    resolve: {
                        closedLocations: function () {
                            return closedLocations;
                        }
                    }
                };
            }

            $uibModal.open(buildHistoryModalOpts(closedLocations));
        }

        function _openModalForCreateClient() {
            function openModal() {
                var _clientModalFormOpts = {
                    templateUrl: 'app/components/client/views/form.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.client = null;
                        $scope.icon = 'fa fa-user-plus';
                        $scope.action = 'Ajouter';
                        $scope.ok = function () {
                            return $uibModalInstance.close($scope.client);
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('Création du client annulé');
                        };
                    }
                };
                var modalInstance = $uibModal.open(_clientModalFormOpts);

                modalInstance.result.then(function (client) {

                    _create(client);
                    toastr.success('Le Client : ' + client.lastName + " " + client.firstName + " crée avec succès");

                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }

            openModal();
        }

        function _openModalForEditClient(client) {
            var myClient = client;

            function openModal() {
                var _clientModalFormOpts = {
                    templateUrl: 'app/components/client/views/form.html',
                    controller: function ($scope, $uibModalInstance) {
                        myClient.dateOfBirth = new Date(myClient.dateOfBirth);
                        myClient.dateDriverLicence = new Date(myClient.dateDriverLicence);
                        $scope.client = jQuery.extend(true, {}, myClient);
                        $scope.icon = 'fa fa-pencil-square-o';
                        $scope.action = 'Editer';
                        $scope.ok = function () {
                            return $uibModalInstance.close($scope.client);
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('Edition du client annulé');
                        };

                    }
                };
                var modalInstance = $uibModal.open(_clientModalFormOpts);

                modalInstance.result.then(function (client) {

                    _update(client);
                    toastr.success('Le Client : ' + client.lastName + " " + client.firstName + " a été mis à jours avec succès");

                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }

            openModal();
        }

        function _remove(client) {
            ClientWebAPI.remove(client).then(function () {
                    $state.go('clients');
                    $state.reload();
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }

        function _create(client) {
            ClientWebAPI.create(client).then(function () {
                    $state.go('clients');
                    $state.reload();
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }

        function _update(client) {
            ClientWebAPI.update(client).then(function () {
                    $state.go('clients');
                    $state.reload();
                },
                function (reason) {
                    console.error(reason);
                }
            );
        }
    }

})();