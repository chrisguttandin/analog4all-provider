import { BrowserService } from './services/browser';
import angular from 'angular';
import instruments from '../instruments/module';
import userMedia from '../user-media/module';

export default angular
    .module('browser', [
        instruments.name,
        userMedia.name
    ])

    .service('browserService', [ 'instrumentsService', 'userMediaService', BrowserService ]);
