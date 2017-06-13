(function init(exports, factory) {
    'use strict';

    var Location = neogenz.beans.AbstractBean.extend({
        initialize: function () {
            neogenz.beans.AbstractBean.prototype.initialize.apply(this, arguments);
            this.id = null;
            this.kms = null;
            this.kmsPenalty = null;
            this.duration = null;
            this.dateStart = null;
            this.dateEnd = null;
            this.hoursStart = null;
            this.hoursEnd = null;
            this.car = null;
            this.agenceStart = null;
            this.agenceEnd = null;
            this.price = null;
            this.pricePenalty = null;
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
                kmsPenalty: new neogenz.beans.AbstractSchema({
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
                price: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.NUMBER
                }),
                pricePenalty: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.NUMBER
                }),
                car: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.OBJECT,
                    beanName: 'Car',
                    constructor: neogenz.beans.Car
                }),
                agenceStart: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.OBJECT,
                    beanName: 'Agence',
                    constructor: neogenz.beans.Agence
                }),
                agenceEnd: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.OBJECT,
                    beanName: 'Agence',
                    constructor: neogenz.beans.Agence
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

    exports.Location = Location;
    factory.registerBean('Location', exports.Location);

}(easilyLocation.beans, neogenz.beans.factory));