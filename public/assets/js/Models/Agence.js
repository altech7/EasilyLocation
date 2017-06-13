(function init(exports, factory) {
    'use strict';

    var Agence = neogenz.beans.AbstractBean.extend({
        initialize: function () {
            neogenz.beans.AbstractBean.prototype.initialize.apply(this, arguments);
            this.id = null;
            this.name = null;
            this.place = null;
            this.updatedAt = null;
            this.createdAt = null;
            this._schema = {
                id: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING,
                    persistingName: '_id'
                }),
                name: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                place: new neogenz.beans.AbstractSchema({
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

    exports.Agence = Agence;
    factory.registerBean('Agence', exports.Agence);

}(easilyLocation.beans, neogenz.beans.factory));