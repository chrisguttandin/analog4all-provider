import { SlotController } from './controllers/slot';
import angular from 'angular';
import angularRoute from 'angular-route';
import { slot } from './routes/slot';

export default angular
    .module('slot', [
        angularRoute
    ])

    .config([ '$routeProvider', ($routeProvider) => $routeProvider.when('/devices/:deviceId', slot) ])

    .controller('SlotController', [ 'device', SlotController ]);
