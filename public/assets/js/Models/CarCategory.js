(function init(exports, factory) {
    'use strict';

    var CarCategory = neogenz.beans.AbstractBean.extend({
        initialize: function () {
            neogenz.beans.AbstractBean.prototype.initialize.apply(this, arguments);
            this.id = null;
            this.name = null;
            this.type = null;
            this.category = null;
            this.audio = null;
            this.engine = null;
            this.updatedAt = null;
            this.createdAt = null;

            // Tourism
            this.gearbox = null;
            this.numberOfDoors = null;
            this.numberOfPassengersAndBaggage = null;
            this.minimumAgeForLocation = null;
            this.requiredLicensingYearsNumber = null;
            this.airConditioner = null;
            this.other = null;

            // Utiliy
            this.assistDirection = null;
            this.nbPorteLaterale = null;
            this.nbPlaces = null;

            this._schema = {
                id: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING,
                    persistingName: '_id'
                }),
                name: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                type: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                category: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                audio: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.ARRAY
                }),
                engine: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.ARRAY
                }),
                powerSteering: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.ARRAY
                }),
                nbLateralDoors: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.ARRAY
                }),
                gearbox: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                numberOfDoors: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.ARRAY
                }),
                numberOfPassengersAndBaggage: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                minimumAgeForLocation: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.NUMBER
                }),
                requiredLicensingYearsNumber: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.NUMBER
                }),
                airConditioner: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                other: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                assistDirection: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.BOOLEAN
                }),
                nbPorteLaterale: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                nbPlaces: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.NUMBER
                }),
                updatedAt: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING,
                    defaultValue: '',
                    mandatory: false
                }),
                createdAt: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING,
                    defaultValue: '',
                    mandatory: false
                })
            };
        }
    });

    exports.CarCategory = CarCategory;
    factory.registerBean('CarCategory', exports.CarCategory);

}(easilyLocation.beans, neogenz.beans.factory));