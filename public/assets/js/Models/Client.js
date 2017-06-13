(function init(exports, factory) {
    'use strict';

    var Client = neogenz.beans.AbstractBean.extend({
        initialize: function () {
            neogenz.beans.AbstractBean.prototype.initialize.apply(this, arguments);
            this.id = null;
            this.firstName = null;
            this.lastName = null;
            this.dateOfBirth = null;
            this.dateDriverLicence = null;
            this.address = null;
            this.currentLocations = null;
            this.comingLocations = null;
            this.closedLocations = null;
            this.updatedAt = null;
            this.createdAt = null;
            this._schema = {
                id: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING,
                    persistingName: '_id'
                }),
                firstName: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                lastName: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                dateOfBirth: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                dateDriverLicence: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                address: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.STRING
                }),
                currentLocations: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.ARRAY_OBJECT,
                    persistingName: 'currentLocations',
                    defaultValue: [],
                    contentObject: new neogenz.beans.AbstractSchema({
                        type: neogenz.beans.type.OBJECT,
                        beanName: 'Location',
                        constructor: neogenz.beans.Location
                    })
                }),
                closedLocations: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.ARRAY_OBJECT,
                    persistingName: 'closedLocations',
                    defaultValue: [],
                    contentObject: new neogenz.beans.AbstractSchema({
                        type: neogenz.beans.type.OBJECT,
                        beanName: 'Location'
                    })
                }),
                comingLocations: new neogenz.beans.AbstractSchema({
                    type: neogenz.beans.type.ARRAY_OBJECT,
                    persistingName: 'comingLocations',
                    defaultValue: [],
                    contentObject: new neogenz.beans.AbstractSchema({
                        type: neogenz.beans.type.OBJECT,
                        beanName: 'Location',
                        constructor: neogenz.beans.Location
                    })
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

    exports.Client = Client;
    factory.registerBean('Client', exports.Client);

}(easilyLocation.beans, neogenz.beans.factory));