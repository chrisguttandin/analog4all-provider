var angular = require('angular'),
    angularRoute = require('angular-route'),
    slot = require('./routes/slot.js'),
    SlotController = require('./controllers/slot.js');

module.exports = angular
    .module('slot', [
        angularRoute
    ])

    .config([ '$routeProvider', ($routeProvider) => $routeProvider.when('/devices/:deviceId', slot) ])

    .controller('SlotController', [ 'device', SlotController ]);
