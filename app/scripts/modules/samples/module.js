import { SamplesService } from './services/samples';
import angular from 'angular';

export default angular
    .module('samples', [])

    .service('samplesService', [ '$http', SamplesService ]);
