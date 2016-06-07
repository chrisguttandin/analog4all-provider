import { RecordingService } from './services/recording';
import angular from 'angular';
import userMedia from '../user-media/module';

export default angular
    .module('recordingService', [
        userMedia.name
    ])

    .service('recordingService', [ 'userMediaService', RecordingService ]);
