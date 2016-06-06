var angular = require('angular'),
    devicesService = require('./services/devices.js');

module.exports = angular
    .module('devices', [])

    .service('devicesService', devicesService);
