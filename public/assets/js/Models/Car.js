(function init(exports, factory) {
    'use strict';

    var Car = neogenz.beans.AbstractBean.extend({
        initialize: function () {
            neogenz.beans.AbstractBean.prototype.initialize.apply(this, arguments);
            this.id = null;
            this.brand = null;
            this.active = null;
            this.model = null;
            this.category = null;
            this.agency = null;
            this.updatedAt = null;
            this.createdAt = null;
            this._schema = {
                id: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING,
                    persistingName: '_id'
                }),
                brand: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                active: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.BOOLEAN
                }),
                model: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                category: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.OBJECT,
                    beanName: 'CarCategory',
                    constructor: neogenz.beans.CarCategory
                }),
                agency: new neogenz.beans.AbstractSchema({
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

    exports.Car = Car;
    factory.registerBean('Car', exports.Car);

}(easilyLocation.beans, neogenz.beans.factory));