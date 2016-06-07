import { LocalRegistryController } from './controllers/local-registry';
import angular from 'angular';
import angularRoute from 'angular-route';
import devices from '../devices/module';
import { localRegistry } from './routes/local-registry';
import midiOutput from '../midi-output/module';

export default angular
    .module('localRegistry', [
        angularRoute,
        devices.name,
        midiOutput.name
    ])

    .config([ '$routeProvider', ($routeProvider) => $routeProvider.when('/devices', localRegistry) ])

    .controller('LocalRegistryController', [ 'devices', 'devicesService', '$scope', LocalRegistryController ]);
