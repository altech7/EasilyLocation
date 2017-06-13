(function init(exports, factory) {
    'use strict';

    var LocationWithId = neogenz.beans.AbstractBean.extend({
        initialize: function () {
            neogenz.beans.AbstractBean.prototype.initialize.apply(this, arguments);
            this.id = null;
            this.kms = null;
            this.duration = null;
            this.dateStart = null;
            this.dateEnd = null;
            this.hoursStart = null;
            this.hoursEnd = null;
            this.car = null;
            this.agenceStart = null;
            this.agenceEnd = null;
            this.typePrice = null;
            this.updatedAt = null;
            this.createdAt = null;
            this._schema = {
                id: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING,
                    persistingName: '_id'
                }),
                kms: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                duration: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                dateStart: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                dateEnd: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                hoursStart: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.NUMBER
                }),
                hoursEnd: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.NUMBER
                }),
                typePrice: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.NUMBER
                }),
                car: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                agenceStart: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                agenceEnd: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
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

    exports.LocationWithId = LocationWithId;
    factory.registerBean('LocationWithId', exports.LocationWithId);

}(easilyLocation.beans, neogenz.beans.factory));