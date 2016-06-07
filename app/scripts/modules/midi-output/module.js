var angular = require('angular'),
    contenteditable = require('../contenteditable/module.js'),
    fileReceivingService = require('./services/file-receiving.js'),
    fileSendingService = require('./services/file-sending.js'),
    instruments = require('../instruments/module.js'),
    middleC = require('./middle-c.json'),
    midiOutput = require('./components/midi-output.js'),
    MidiOutputController = require('./controllers/midi-output.js'),
    recording = require('../recording/module.js'),
    registeringService = require('./services/registering.js'),
    renderingService = require('./services/rendering.js'),
    samples = require('../samples/module.js'),
    scale = require('./scale.json'),
    userMedia = require('../user-media/module.js'),
    waitingService = require('./services/waiting.js');

module.exports = angular
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

    .service('fileReceivingService', [ fileReceivingService ])
    .service('fileSendingService', [ fileSendingService ])
    .service('registeringService', [ 'instrumentsService', 'userMediaService', registeringService ])
    .service('renderingService', [ 'fileReceivingService', 'fileSendingService', 'recordingService', 'waitingService', renderingService ])
    .service('waitingService', [ waitingService ]);
