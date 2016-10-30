import angular from 'angular';
import angularRoute from 'angular-route';
import provider from './modules/provider/module';

export const app = angular
    .module('app', [
        angularRoute,
        provider.name
    ])

    .config([ '$routeProvider', ($routeProvider) => $routeProvider.otherwise({ redirectTo: '/devices' }) ]);
