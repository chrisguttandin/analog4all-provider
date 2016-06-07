var angular = require('angular'),
    angularRoute = require('angular-route'),
    devices = require('../devices/module.js'),
    localRegistry = require('./routes/local-registry.js'),
    LocalRegistryController = require('./controllers/local-registry.js'),
    midiOutput = require('../midi-output/module.js');

module.exports = angular
    .module('localRegistry', [
        angularRoute,
        devices.name,
        midiOutput.name
    ])

    .config([ '$routeProvider', ($routeProvider) => $routeProvider.when('/devices', localRegistry) ])

    .controller('LocalRegistryController', [ 'devices', 'devicesService', '$scope', LocalRegistryController ]);
