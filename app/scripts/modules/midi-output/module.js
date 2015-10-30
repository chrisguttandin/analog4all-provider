'use strict';

var angular = require('angular'),
    middleC = require('./middle-c.json'),
    midiOutput = require('./directives/midi-output.js'),
    MidiOutputController = require('./controllers/midi-output.js'),
    scale = require('./scale.json');

module.exports = angular
    .module('midiOutput', [])

    .constant('middleC', middleC)
    .constant('scale', scale)

    .controller('MidiOutputController', ['fileReceivingService', 'fileSendingService', 'instrumentsService', 'middleC', 'recordingService', 'registeringService', 'samplesService', 'scale', '$scope', MidiOutputController])

    .directive('midiOutput', midiOutput);
