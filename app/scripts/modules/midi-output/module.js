import { FileReceivingService } from './services/file-receiving';
import { FileSendingService } from './services/file-sending';
import { MidiOutputController } from './controllers/midi-output';
import { RegisteringService } from './services/registering';
import { RenderingService } from './services/rendering';
import { WaitingService } from './services/waiting';
import angular from 'angular';
import contenteditable from '../contenteditable/module';
import instruments from '../instruments/module';
import middleC from './middle-c.json';
import { midiOutput } from './components/midi-output';
import recording from '../recording/module';
import samples from '../samples/module';
import scale from './scale.json';
import userMedia from '../user-media/module';

export default angular
    .module('midiOutput', [
        contenteditable.name,
        instruments.name,
        recording.name,
        samples.name,
        userMedia.name
    ])

    .constant('middleC', middleC)
    .constant('scale', scale)

    .component('midiOutput', midiOutput)

    .controller('MidiOutputController', [ 'fileReceivingService', 'fileSendingService', 'instrumentsService', 'middleC', 'recordingService', 'registeringService', 'renderingService', 'samplesService', 'scale', '$scope', MidiOutputController ])

    .service('fileReceivingService', [ FileReceivingService ])
    .service('fileSendingService', [ FileSendingService ])
    .service('registeringService', [ 'instrumentsService', 'userMediaService', RegisteringService ])
    .service('renderingService', [ 'fileReceivingService', 'fileSendingService', 'recordingService', 'waitingService', RenderingService ])
    .service('waitingService', [ WaitingService ]);
