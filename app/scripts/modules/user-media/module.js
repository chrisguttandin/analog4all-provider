import { UserMediaService } from './services/user-media';
import angular from 'angular';

export default angular
    .module('user-media', [])

    .service('userMediaService', [ UserMediaService ]);
