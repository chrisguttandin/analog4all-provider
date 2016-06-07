var angular = require('angular'),
    angularRoute = require('angular-route'),
    provider = require('./modules/provider/module.js');

module.exports = angular
    .module('app', [
        angularRoute,
        provider.name,
    ])

    .config([ '$routeProvider', ($routeProvider) => $routeProvider.otherwise({ redirectTo: '/devices' }) ]);
