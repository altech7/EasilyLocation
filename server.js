var env = "development";
var dbConfig = require('./config/database.json')[env];
var express = require('express');
var app = express();

var endpointConfig = require('./config/endpoint.json')[env];
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');

var mongoose = require('mongoose');

// configuration ==============================================================
app.set('port', endpointConfig.portNumber);
process.env.JWT_SECRET = 'applicationeasilylocation';
app.use(bodyParser.json());// get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
// options ====================================================================
app.use(morgan('dev'));
// very request to the console
app.use(cors({credentials: true, origin: true}));

// Run server ==================================================================
var dbURI = dbConfig.mongoDb.protocol + '://' + dbConfig.mongoDb.host + '/' + dbConfig.mongoDb.name;
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
    require('./routing')(app, mongoose, jwt);
    require('./02_Webservices/LoginWebServices')(app);
    require('./02_Webservices/ParkWebServices')(app);
    require('./02_Webservices/ClientWebServices')(app);
    require('./02_Webservices/LocationWebServices')(app);
    require('./02_Webservices/AgencyWebServices')(app);
    require('./02_Webservices/FacturationWebServices')(app);

    // Initialisation JSON for first use.
    var agenceProvider = require('./03_DataAccessLayer/AgenceProvider');
    var parkProvider = require('./03_DataAccessLayer/ParkProvider');
    var carCategoryProvider = require('./03_DataAccessLayer/CarCategoryProvider');
    var clientProvider = require('./03_DataAccessLayer/ClientProvider');
    var archiveProvider = require('./03_DataAccessLayer/ArchiveProvider');
    var priceProdiver = require('./03_DataAccessLayer/PriceProvider');

    mongoose.connection.db.listCollections({name: 'Agences'})
        .next(function (err, collinfo) {
            if (err) {
                throw err;
            }
            if (!collinfo) {
                var agencies, categories, cars;
                agenceProvider.initAllDefaultAgencies().then(function (agenciesSaved) {
                    agencies = agenciesSaved;
                    return carCategoryProvider.initAllDefaultCategories();
                }).then(function (categoriesSaved) {
                    categories = categoriesSaved;
                    return parkProvider.initDefaultPark(agencies, categories);
                }).then(function (carsSaved) {
                    return clientProvider.initClient();
                }).then(function (carsSaved) {
                    cars = carsSaved;
                    return priceProdiver.initAllDefaultPrice(categories);
                }).then(function (prices) {
                    return archiveProvider.initArchive();
                }).then(function (archive) {
                });
            }
        }
    );

    console.log('Express server listening on port ' + app.get('port'));
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

app.listen(3000);