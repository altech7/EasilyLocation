(function () {
    'use strict';

    var priceGeneratorComponent = {
        templateUrl: 'app/components/location/views/price.html',
        controller: PriceGeneratorController,
        controllerAs: 'priceGeneratorCtrl',
        bindings: {
            onFinish: '&',
            onCancel: '&',
            prices: '<'
        }
    };

    angular
        .module('appEasilyLocation')
        .component('priceGeneratorCmp', priceGeneratorComponent);

    PriceGeneratorController.$inject = [
        'LocationWebAPI',
        'toastr'
    ];


    /**
     * @class PriceGeneratorController
     */
    function PriceGeneratorController(LocationWebAPI, toastr) {
        var self = this;

        (function init() {
            defineScope();
            defineListeners();
        })();


        /**
         * @desc Defines all $scope variables
         * @function defineScope
         */
        function defineScope() {
            self.pricesViewObject = LocationWebAPI.fromPricesToViewObject(self.prices);
            self.itemToAdd = null;
            self.pricesSelected = [];
        }


        /**
         * @desc Attach view listeners to this controller
         * @function defineListeners
         */
        function defineListeners() {
            self.finish = _finish;
            self.cancel = _cancel;
            self.addCurrentItem = _addCurrentItem;
            self.removeThisItemSelectedByIndex = _removeThisItemSelectedByIndex;
        }


        /**
         * @desc Close the modal with a promise resolve to success
         * @function _finish
         */
        function _finish() {
            self.onFinish({$pricesToApply: self.pricesSelected});
        }


        /**
         * @desc Close the modal with a promise resolve to error
         * @function _cancel
         */
        function _cancel() {
            self.onCancel();
        }


        function _resetItemToAdd() {
            self.itemToAdd = null;
        }

        function _addCurrentItem() {
            self.pricesSelected.push(self.itemToAdd);
            _resetItemToAdd();
            toastr.success('Ajouté !');
        }

        function _removeThisItemSelectedByIndex(index) {
            self.pricesSelected.splice(index, 1);
            toastr.success('Supprimé !');
        }
    }
})();