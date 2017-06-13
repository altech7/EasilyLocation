'use strict';

(function init() {
    var moment = require('moment');


    function DateHelper() {
    }

    DateHelper.prototype.verifyDates = function (dateStart, dateEnd, hoursStart, hoursEnd) {

        var dateStart = new Date(dateStart).setHours(hoursStart).form;
        var dateEnd = new Date(dateEnd).setHours(hoursEnd);
        var err = "";
        if (dateEnd <= dateStart) {
            err = "La date de fin est égale ou inférieure à la date de début";
            throw err;
        } else if (dateStart <= Date.now()) {
            err = "La date de début est supérieure à la date du jour";
            throw err;
        }
    };

    DateHelper.prototype.fromDateStringUrlToDate = function (dateString) {
        var dateReg = /^\d{2}([-])\d{2}\1\d{4}$/,
            dateStringSplitted = null;

        if (!dateString.match(dateReg)) {
            throw new Error('Mauvais format de date.');
        }
        dateStringSplitted = dateString.split('-');
        return new Date(dateStringSplitted[2] + '-' + dateStringSplitted[1] + '-' + dateStringSplitted[0]);
    };

    DateHelper.prototype.getEndDateOfConcurentPeriod = function (periodToNeedReserved, periodAlreadyReserved) {

        if (periodAlreadyReserved.startDate >= periodToNeedReserved.startDate &&
            periodAlreadyReserved.endDate <= periodToNeedReserved.endDate) {
            return moment(periodAlreadyReserved.endDate).add(1, 'days');
        }
        if ((periodAlreadyReserved.startDate >= periodToNeedReserved.startDate &&
            periodAlreadyReserved.startDate <= periodToNeedReserved.endDate) &&
            periodAlreadyReserved.endDate >= periodToNeedReserved.endDate) {
            return moment(periodAlreadyReserved.endDate).add(1, 'days');
        }
        if (periodAlreadyReserved.startDate <= periodToNeedReserved.startDate &&
            (periodAlreadyReserved.endDate <= periodToNeedReserved.endDate &&
            periodAlreadyReserved.endDate >= periodToNeedReserved.startDate
            )) {
            return moment(periodAlreadyReserved.endDate).add(1, 'days');
        }
        if ((periodAlreadyReserved.startDate >= periodToNeedReserved.startDate &&
            periodAlreadyReserved.startDate <= periodToNeedReserved.endDate) &&
            periodAlreadyReserved.endDate >= periodToNeedReserved.endDate) {
            return moment(periodAlreadyReserved.endDate).add(1, 'days');
        }
        if (periodAlreadyReserved.startDate <= periodToNeedReserved.startDate &&
            periodAlreadyReserved.endDate >= periodToNeedReserved.endDate) {
            return moment(periodAlreadyReserved.endDate).add(1, 'days');
        }
        return null;
    };

    module.exports = new DateHelper();
})();