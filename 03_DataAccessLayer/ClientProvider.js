'use strict';

(function init() {
    var _ = require('underscore');
    var moment = require('moment');
    var Client = require('../04_Models/Client');
    var Price = require('../04_Models/Price');
    var archiveProvider = require('../03_DataAccessLayer/ArchiveProvider');
    var priceProvider = require('../03_DataAccessLayer/PriceProvider');

    function ClientProvider() {
    }

    ClientProvider.prototype.initClient =
        function _initClient() {
            return new Client({
                firstName: 'Antoine',
                lastName: 'Altmayer',
                dateOfBirth: new Date('02/05/1994'),
                dateDriverLicence : moment(new Date('02/05/1994')).add(18, 'years').toDate(),
                address: '20, Place Pan Carre'
            }).save();
        };

    ClientProvider.prototype.create = function (json) {
        //var dateOfBirth = new Date(json.dateOfBirth);
        //dateOfBirth.setHours(0, 0, 0, 0);
        //dateOfBirth = moment(dateOfBirth).add(1, 'h').toDate();

        var ClientToSave = new Client({
            firstName: json.firstName,
            lastName: json.lastName,
            dateOfBirth: json.dateOfBirth,
            dateDriverLicence: json.dateDriverLicence,
            address: json.address,
            currentLocations: json.currentLocations,
            closedLocations: json.closedLocations,
            comingLocations: json.comingLocations
        });
        return ClientToSave.save();
    };

    ClientProvider.prototype.updatePricesApplied = function (idClient, idLocation, prices) {
        var locationFromComing = null, locationFromCurrent = null, price = null;
        return Client
            .findOne({_id: idClient})
            .then(function (client) {

                locationFromComing = _.find(client.comingLocations, function (item) {
                    return item._id.equals(idLocation);
                });
                locationFromCurrent = _.find(client.currentLocations, function (item) {
                    return item._id.equals(idLocation);
                });

                if (locationFromComing) {
                    client.comingLocations = _.reject(client.comingLocations, function (item) {
                        return item._id.equals(idLocation);
                    });
                    locationFromComing.pricesApplied = [];
                    prices.forEach(function (item) {
                        price = new Price({
                            days: item.days,
                            km: item.km,
                            price: item.price,
                            category: item.category
                        });
                        locationFromComing.pricesApplied.push(price);
                    });
                    if (!client.comingLocations) {
                        client.comingLocations = [];
                    }

                    var total = 0;
                    locationFromComing.pricesApplied.forEach(function (item) {
                        total = total + parseInt(item.price);
                    });
                    locationFromComing.price = "";
                    locationFromComing.price = total;

                    client.comingLocations = client.comingLocations.concat(locationFromComing);
                } else {
                    client.currentLocations = _.reject(client.currentLocations, function (item) {
                        return item._id.equals(idLocation);
                    });
                    locationFromCurrent.pricesApplied = [];
                    prices.forEach(function (item) {
                        var price = new Price({
                            days: item.days,
                            km: item.km,
                            price: item.price,
                            category: item.category
                        });
                        //if (!locationFromCurrent.pricesApplied) {

                            locationFromCurrent.pricesApplied.push(price);
                        //}
                    });
                    if (!client.currentLocations) {
                        client.currentLocations = [];
                    }

                    var total = 0;
                    locationFromCurrent.pricesApplied.forEach(function (item) {
                        total = total + parseInt(item.price);
                    });
                    locationFromCurrent.price = "";
                    locationFromCurrent.price = total;

                    client.currentLocations.push(locationFromCurrent);
                }

                return client.save();
            }
        )
    };

    ClientProvider.prototype.update = function (id, json) {
        return Client
            .findByIdAndUpdate(id,
            {
                firstName: json.firstName,
                lastName: json.lastName,
                dateOfBirth: json.dateOfBirth,
                dateDriverLicence: json.dateDriverLicence,
                address: json.address
            }
        ).exec();
    };

    ClientProvider.prototype.delete = function (id) {
        return Client.findByIdAndRemove(id, function (err) {
            if (err) {
                throw err;
            }
        });
    };

    ClientProvider.prototype.findAll = function () {
        return Client
            .find()
            .populate({
                path: 'closedLocations.car'
            })
            .populate({
                path: 'closedLocations.agenceStart'
            })
            .populate({
                path: 'closedLocations.agenceEnd'
            });
    };

    ClientProvider.prototype.findAllWithCarsAndAgencies = function () {
        return Client
            .find()
            .populate({path: 'closedLocations.car'})
            .populate({path: 'closedLocations.agenceStart'})
            .populate({path: 'closedLocations.agenceEnd'})
            .populate({path: 'comingLocations.car'})
            //.populate({path: 'comingLocations.car.category'})
            .populate({path: 'comingLocations.agenceStart'})
            .populate({path: 'comingLocations.agenceEnd'})
            .populate({path: 'currentLocations.car'})
            //.populate({path: 'currentLocations.car.category'})
            .populate({path: 'currentLocations.agenceStart'})
            .populate({path: 'currentLocations.agenceEnd'})
            .exec().then(function (clients) {
                var options = {
                    path: 'currentLocations.car.category',
                    model: 'CarCategory'
                };

                return Client.populate(clients, options);
            }).then(function (clients) {
                return clients;
            });
    };

    ClientProvider.prototype.addComingLocation = function (id, location) {
        return Client
            .findOne({_id: id})
            .then(function (client) {
                client.comingLocations.push(location);
                return client.save();
            }
        )
    };

    ClientProvider.prototype.addCurrentLocation = function (id, location) {
        return Client
            .findOne({_id: id})
            .then(function (client) {
                client.currentLocations.push(location);
                return client.save();
            }
        )
    };

    ClientProvider.prototype.modifyLocation = function (idClient, idLocation, location) {
        return Client
            .findOne({_id: idClient})
            .then(function (client) {
                var locationToModify, isComing;
                locationToModify = _.find(client.comingLocations, function (item) {
                    isComing = true;
                    return item._id.equals(idLocation);
                });
                if (isComing) {
                    locationToModify = location;
                    client.comingLocations.push(locationToModify);
                } else {
                    locationToModify = _.find(client.currentLocations, function (item) {
                        return item._id.equals(idLocation);
                    });
                    locationToModify = location;
                    client.currentLocations.push(locationToModify);
                }

                return client.save();
            }
        )
    };

    ClientProvider.prototype.clotureLocation = function (idClient, idLocation, kmsPenalty) {
        return Client
            .findOne({_id: idClient})
            .then(function (client) {
                var locationToCloture = _.find(client.currentLocations, function (item) {
                    return item._id.equals(idLocation);
                });
                client.currentLocations = _.reject(client.currentLocations, function (item) {
                    return item._id.equals(idLocation);
                });

                locationToCloture.kmsPenalty = kmsPenalty;
                if (kmsPenalty > 0) {
                    var priceOfKms = (locationToCloture.price / locationToCloture.kms);
                    var pricePenalty = (priceOfKms * locationToCloture.kmsPenalty * 1.25);
                    //var total = locationToCloture.price + (( 50 * locationToCloture.price) / locationToCloture.kms) * 1.25;

                    locationToCloture.pricePenalty = pricePenalty;
                }
                client.closedLocations.push(locationToCloture);
                return client.save();
            }
        )
    };

    ClientProvider.prototype.archiveLocation = function (idClient, idLocation) {
        return Client
            .findOne({_id: idClient})
            .then(function (client) {

                var locationToArchived = _.find(client.closedLocations, function (item) {
                    return item._id.equals(idLocation);
                });

                archiveProvider.addArchive(client, locationToArchived).then(function (archive) {

                    client.closedLocations = _.reject(client.closedLocations, function (item) {
                        return item._id.equals(idLocation);
                    });

                    return client.save();
                });
            }
        )
    };

    ClientProvider.prototype.confirmLocation = function (idClient, idLocation) {
        return Client
            .findOne({_id: idClient})
            .then(function (client) {
                var locationToConfirm = _.find(client.comingLocations, function (item) {
                    return item._id.equals(idLocation);
                });

                client.comingLocations = _.reject(client.comingLocations, function (item) {
                    return item._id.equals(idLocation);
                });

                client.currentLocations.push(locationToConfirm);

                return client.save();
            }
        )
    };

    ClientProvider.prototype.findAllCurrentLocations = function () {
        var locations = [];
        return Client.find({})
            .populate('currentLocations.car')
            .then(function (clients) {
                var options = {
                    path: 'currentLocations.car.category',
                    model: 'CarCategory'
                };
                return Client.populate(clients, options);
            })
            .then(function (clients) {
                clients.forEach(function (item) {
                    locations = locations.concat(item.currentLocations);
                });
                return locations;
            });
    };

    ClientProvider.prototype.findAllComingLocations = function () {
        var locations = [];
        return Client.find({})
            .populate('comingLocations.car')
            .then(function (clients) {
                var options = {
                    path: 'comingLocations.car.category',
                    model: 'CarCategory'
                };
                return Client.populate(clients, options);
            })
            .then(function (clients) {
                clients.forEach(function (item) {
                    locations = locations.concat(item.comingLocations);
                });
                return locations;
            });
    };

    ClientProvider.prototype.findById = function (id) {
        return Client
            .find({_id: id})
            .populate("comingLocation.car")
            .then(function (clients) {
                var options = {
                    path: 'comingLocations.car.category',
                    model: 'CarCategory'
                };
                return Client.populate(clients, options);
            })
            .then(function (clients) {
                return clients;
            });
    };

    ClientProvider.prototype.addComingLocationToClientFromApiAndroid = function (location) {
        var client = null;
        return this.findOrCreateBy(location.firstName, location.lastName, location.birthDate)
            .then(function (clientFinded) {
                client = clientFinded;
                return priceProvider.generatePrice(location.duration, location.kms, location.car);
            }).then(function (priceGenerated) {
                location.price = priceGenerated.price;
                client.comingLocations.push(location);
                return client.save();
            });
    };

    ClientProvider.prototype.findOrCreateBy = function (firstname, lastname, birthdate) {
        return Client.findOne({firstName: firstname, lastName: lastname})
            .then(function (finded) {
                if (!finded) {
                    var client = new Client();
                    client.dateOfBirth = birthdate;
                    client.dateDriverLicence = moment(birthdate).add(18, 'years').toDate();
                    client.firstName = firstname;
                    client.lastName = lastname;
                    client.address = '/';
                    return client.save();
                }
                return finded;
            }).then(function (client) {
                return client;
            }).catch(function (err) {
                console.error(err);
                return new Error('Erreur lors de la récupération du client.');
            });
    };


    module.exports = new ClientProvider();

})();