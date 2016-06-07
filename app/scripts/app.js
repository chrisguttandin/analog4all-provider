var angular = require('angular'),
    angularRoute = require('angular-route'),
    provider = require('./modules/provider/module.js');

module.exports = angular
    .module('app', [
        angularRoute,
        provider.name,
    ])

    .config([ '$routeProvider', ($routeProvider) => $routeProvider.otherwise({ redirectTo: '/devices' }) ]);

// import angular from 'angular';
// import angularRoute from 'angular-route';
// import provider from './modules/provider/module.js';
//
// export const app = angular
//     .module('app', [
//         angularRoute,
//         provider.name,
//     ])
//
//     .config([ '$routeProvider', ($routeProvider) => $routeProvider.otherwise({ redirectTo: '/devices' }) ]);
