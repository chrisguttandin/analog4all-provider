var angular = require('angular'),
    middleC = require('./middle-c.json'),
    midiOutput = require('./directives/midi-output.js'),
    MidiOutputController = require('./controllers/midi-output.js'),
    renderingService = require('./services/rendering.js'),
    scale = require('./scale.json'),
    waitingService = require('./services/waiting.js');

module.exports = angular
    .module('midiOutput', [])

    .constant('middleC', middleC)
    .constant('scale', scale)

    .controller('MidiOutputController', ['fileReceivingService', 'fileSendingService', 'instrumentsService', 'middleC', 'recordingService', 'registeringService', 'renderingService', 'samplesService', 'scale', '$scope', MidiOutputController])

    .directive('midiOutput', midiOutput)

    .service('renderingService', [ 'fileReceivingService', 'fileSendingService', 'recordingService', 'waitingService', renderingService ])
    .service('waitingService', [ waitingService ]);
