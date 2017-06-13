'use strict';

(function init() {
    var Archive = require('../04_Models/Archive');

    function ArchiveProvider() {
    }

    ArchiveProvider.prototype.initArchive =
        function _initArchive() {
            return new Archive().save();
        };

    ArchiveProvider.prototype.addArchive = function (client, location) {
        return Archive
            .findOne({'client._id': client._id})
            .then(function (archive) {
                if (archive) {
                    archive.locations.push(location);
                    return archive.save();
                } else {
                    var ArchiveToSave = new Archive({
                        client: client,
                        locations: location
                    });
                    return ArchiveToSave.save();
                }
            }
        );
    };

    module.exports = new ArchiveProvider();
})();