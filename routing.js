var authenticationHelpers = require('./01_Commons/authenticationHelpers');

module.exports = function (provider) {
    var publicDir = __dirname + '/public/';
    var css = publicDir; // + "css/";
    var js = publicDir;// + "js/";
    var fonts = publicDir;

    provider.get(['/billings/*/*.pdf'],
        function (req, res) {
            res.sendFile(__dirname + req.originalUrl);
        });

    provider.get(['/', '*/app/components/*.html', '*/app/shared/*.html'],
        function (req, res) {
            res.sendFile(publicDir + req.originalUrl);
        });

    provider.get(['*/app/app.js', '*/app/routing.js', '*/assets/libs/*.js',
            '*/assets/js/*.js', '*/app/components/*.js', '*/app/shared/*.js'],
        function (req, res) {
            res.sendFile(js + req.originalUrl);
        });

    provider.get(['*/node_modules/angular-aria/*.js', '*/node_modules/angular/*.js',
            '*/node_modules/angular-material/*.js', '*/node_modules/angular-material/*.css', '*/node_modules/angular-wizard/*.js', '*/node_modules/angular-animate/*.js'],
        function (req, res) {
            res.sendFile(__dirname + req.originalUrl);
        });

    provider.get('*.css', function (req, res) {
        res.sendFile(css + req.originalUrl);
    });

    provider.get(['*.woff', '*.ttf', '*.woff2'], function (req, res) {
        res.sendFile(fonts + req.path);
    });

    function getUserAuthenticated(req, res) {
        res.send(req.user);
    }

    provider.get('/isAuthenticated', authenticationHelpers.ensureAuthorized, getUserAuthenticated);
}
;