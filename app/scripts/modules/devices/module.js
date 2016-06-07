import { DevicesService } from './services/devices';
import angular from 'angular';

export default angular
    .module('devices', [])

    .service('devicesService', [ DevicesService ]);
