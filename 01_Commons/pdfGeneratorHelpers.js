'use strict';
var PDFDocument = require('pdfkit'),
    moment = require('moment'),
    fs = require('fs'),
    mkpath = require('mkpath'),
    Q = require('q'),
    numeral = require('numeral'),
    priceProvider = require('../03_DataAccessLayer/PriceProvider'),
    clientProvider = require('../03_DataAccessLayer/ClientProvider'),
    parkProvider = require('../03_DataAccessLayer/ParkProvider'),
    carCategoryProvider = require('../03_DataAccessLayer/CarCategoryProvider'),
    uuid = require('node-uuid'),
    moment = require('moment');

// load a language
numeral.language('fr', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal: function (number) {
        return number === 1 ? 'er' : 'ème';
    },
    currency: {
        symbol: '€'
    }
});

// switch between languages
numeral.language('fr');

function PdfGeneratorHelpers() {
}

PdfGeneratorHelpers.prototype.generateQuoteBy = _generateQuoteBy;
PdfGeneratorHelpers.prototype.generateBillBy = _generateBillBy;

/**
 * @function _generateQuoteBy
 * @desc Generate an quote PDF
 * @returns {Date}
 */
function _generateQuoteBy(clientId, locationId) {
    var client = null,
        location = null,
        path = 'billings/client-' + clientId + '/location-' + locationId,
        fileName = 'quote.pdf',
        deferred = Q.defer(),
        carCategory = null,
        cars = null;
    var duration = null;

    return clientProvider.findById(clientId).then(function (clientFinded) {
        client = clientFinded[0];
        location = clientFinded[0].comingLocations.id(locationId);
        if (!location) {
            throw new Error('La location avec l\'id ' + locationId + 'n\'existe pas pour le client d\'id ' + clientId);
        }
        mkpath(path, function (err) {
            if (err) {
                console.log(err.message);
                throw new Error('Erreur lors de la création du répertoire du devis.');
            }
            console.log('Directory ' + path + ' created.');
            deferred.resolve(path);
        });
        return deferred.promise;
    }).then(function () {
        return parkProvider.findById(location.car);
    }).then(function (car) {
        //carCategory = car;
        cars = car[0];
        var a = moment(location.dateEnd);
        var b = moment(location.dateStart);
        duration = a.diff(b, 'days');
        return priceProvider.generatePrice(duration, location.kms, location.car);
    }).then(function (prices) {
        _buildQuoteBy(path, fileName, client, location, carCategory, prices.price, cars, duration);
        return path + '/' + fileName;
    });
}

function _buildQuoteBy(path, fileName, client, location, carCategory, prices, car, duration) {
    var doc = new PDFDocument(),
        font = 'Helvetica',
        boldFont = 'Helvetica-Bold',
        offsetY = 20,
        y = 300,
        priceXTitle = 470,
        priceX = 475;


    doc.pipe(fs.createWriteStream(path + '/' + fileName));

    doc.font(font);

    doc.fontSize(21)
        .text('Devis', {width: 450, align: 'center'})
        .text('Easily Location', {width: 450, align: 'left'})
        .fontSize(10)
        .text('ESIMED', {width: 450, align: 'left'})
        .text('Marseille', {width: 450, align: 'left'})
        .moveDown()
        .font(boldFont)
        .fontSize(12)
        .text(client.firstName + ' ' + client.lastName, {width: 450, align: 'left'})
        .fontSize(12)
        .text(client.address, {width: 450, align: 'left'});

    doc.fontSize(14)
        .font(boldFont)
        .text('Fait le :', 100, 110, {widht: '412', align: 'right'})
        .font(font)
        .text(moment().format('DD/MM/YYYY'), {widht: '412', align: 'right'})
        .font(boldFont)
        .text('à :', 100, 145, {widht: '412', align: 'right'})
        .font(font)
        .text('Marseille', {widht: '412', align: 'right'})
        .rect(400, 100, 150, 80).stroke();

    doc
        .font(boldFont)
        .text('Description', 80, y, {width: 450, align: 'left'})
        .text('Quantité', 400, y, {width: 450, align: 'left'})
        .text('Prix', priceXTitle, y, {width: 450, align: 'left'})
        .rect(70, 280, 485, 400).stroke();

    y += offsetY;
    doc
        .font(font)
        .text(car.brand + ' ' + car.model + ' (Catégorie ' + car.category.type + ')', 85, y, {
            width: 450,
            align: 'left'
        })
        .text('1', 405, y, {width: 450, align: 'left'})
        .text('', priceX, y, {width: 450, align: 'left'});

    y += offsetY;
    doc
        .font(font)
        .text('Location de ' + duration + ' jours pour ' + numeral(location.kms).format('0,0') + ' km', 85, y, {
            width: 450,
            align: 'left'
        })
        .text('1', 405, y, {width: 450, align: 'left'})
        .text(numeral(location.price).format('0,0[.]00 $'), priceX, y, {width: 450, align: 'left'});

    //for (var i = 0; i < prices.length; i++) {
    //    y += offsetY;
    //    doc
    //        .font(font)
    //        .text('Forfait de catégorie ' + prices[i].category.category + ' - ' + numeral(prices[i].days).format('0,0') + ' jours - ' + numeral(prices[i].km).format('0,0') + ' km', 85, y, {
    //            width: 450,
    //            align: 'left'
    //        })
    //        .text('1', 405, y, {width: 450, align: 'left'})
    //        .text(numeral(prices[i].price).format('0,0[.]00 $'), priceX, y, {width: 450, align: 'left'});
    //}

    doc
        .font(boldFont)
        .text('Total', 80, 660, {width: 450, align: 'left'})
        .font(font)
        .text(numeral(location.price).format('0,0[.]00 $'), priceX, 660, {width: 450, align: 'left'});

    doc.end();
}


/**
 * @function _generateBillBy
 * @desc Generate an bill PDF
 * @returns {Date}
 */
function _generateBillBy(clientId, locationId) {
    var client = null,
        location = null,
        path = 'billings/client-' + clientId + '/location-' + locationId,
        fileName = 'bill.pdf',
        deferred = Q.defer(),
        cars = null;
    var duration = null;


    return clientProvider.findById(clientId).then(function (clientFinded) {
        client = clientFinded[0];
        location = clientFinded[0].closedLocations.id(locationId);
        if (!location) {
            throw new Error('La location avec l\'id ' + locationId + ' n\'existe pas pour le client d\'id ' + clientId);
        }
        mkpath(path, function (err) {
            if (err) {
                console.log(err.message);
                throw new Error('Erreur lors de la création du répertoire du devis.');
            }
            console.log('Directory ' + path + ' created.');
            deferred.resolve(path);
        });
        return deferred.promise;
    }).then(function () {
        return parkProvider.findById(location.car);
    }).then(function (car) {
        cars = car[0];
        var a = moment(location.dateEnd);
        var b = moment(location.dateStart);
        duration = a.diff(b, 'days');
        return priceProvider.generatePrice(duration, location.kms, location.car);
    }).then(function (prices) {
        _buildBillBy(path, fileName, client, location, prices, cars, duration);
        return path + '/' + fileName;
    });
}

function _buildBillBy(path, fileName, client, location, prices, car, duration) {
    var doc = new PDFDocument(),
        font = 'Helvetica',
        boldFont = 'Helvetica-Bold',
        offsetY = 20,
        y = 300,
        priceXTitle = 470,
        priceX = 475;

    doc.pipe(fs.createWriteStream(path + '/' + fileName));

    doc.font(font);

    doc.fontSize(21)
        .text('Facture', {width: 450, align: 'center'})
        .text('Easily Location', {width: 450, align: 'left'})
        .fontSize(10)
        .text('ESIMED', {width: 450, align: 'left'})
        .text('Marseille', {width: 450, align: 'left'})
        .moveDown()
        .font(boldFont)
        .fontSize(12)
        .text(client.firstName + ' ' + client.lastName, {width: 450, align: 'left'})
        .fontSize(12)
        .text(client.address, {width: 450, align: 'left'});

    doc.fontSize(14)
        .font(boldFont)
        .text('Fait le :', 100, 110, {widht: '412', align: 'right'})
        .font(font)
        .text(moment().format('DD/MM/YYYY'), {widht: '412', align: 'right'})
        .font(boldFont)
        .text('à :', 100, 145, {widht: '412', align: 'right'})
        .font(font)
        .text('Marseille', {widht: '412', align: 'right'})
        .rect(400, 100, 150, 80).stroke();

    doc
        .font(boldFont)
        .text('Description', 80, y, {width: 450, align: 'left'})
        .text('Quantité', 400, y, {width: 450, align: 'left'})
        .text('Prix', priceXTitle, y, {width: 450, align: 'left'})
        .rect(70, 280, 485, 400).stroke();

    y += offsetY;
    doc
        .font(font)
        .text(car.brand + ' ' + car.model + ' (Catégorie ' + car.category.type + ')', 85, y, {
            width: 450,
            align: 'left'
        })
        .text('1', 405, y, {width: 450, align: 'left'})
        .text('', priceX, y, {width: 450, align: 'left'});

    y += offsetY;
    doc
        .font(font)
        .text('Location de ' + duration + ' jours pour ' + numeral(location.kms).format('0,0') + ' kms', 85, y, {
            width: 450,
            align: 'left'
        })
        .text('1', 405, y, {width: 450, align: 'left'})
        .text(numeral(location.price).format('0,0[.]00 $'), priceX, y, {width: 450, align: 'left'});

    //for (var i = 0; i < prices.length; i++) {
    //    y += offsetY;
    //    doc
    //        .font(font)
    //        .text('Forfait de catégorie ' + prices[i].category.category + ' - ' + numeral(prices[i].days).format('0,0') + ' jours - ' + numeral(prices[i].km).format('0,0') + ' km', 85, y, {
    //            width: 450,
    //            align: 'left'
    //        })
    //        .text('1', 405, y, {width: 450, align: 'left'})
    //        .text(numeral(prices[i].price).format('0,0[.]00 $'), priceX, y, {width: 450, align: 'left'});
    //}

    y += offsetY;
    doc
        .font(font)
        .fillColor('red')
        .text(numeral(location.kmsPenalty).format('0,0') + ' kms de pénalités', 85, y, {
            width: 450,
            align: 'left'
        })
        .text('1', 405, y, {width: 450, align: 'left'})
        .text(numeral(location.pricePenalty).format('0,0[.]00 $'), priceX, y, {width: 450, align: 'left'});

    var pricePenalty = 0;
    if (location.pricePenalty) {
        pricePenalty = location.pricePenalty;
    }
    doc
        .font(boldFont)
        .fillColor('black')
        .text('Total', 80, 660, {width: 450, align: 'left'})
        .font(font)
        .text(numeral(location.price + pricePenalty).format('0,0[.]00 $'), priceX, 660, {
            width: 450,
            align: 'left'
        });

    doc.end();
}

module.exports = new PdfGeneratorHelpers();