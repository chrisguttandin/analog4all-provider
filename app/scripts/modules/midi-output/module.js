'use strict';

var angular = require('angular'),
    midiOutput = require('./directives/midi-output.js'),
    MidiOutputController = require('./controllers/midi-output.js'),
    scale = require('./scale.json');

module.exports = angular
    .module('midiOutput', [])

    .constant('scale', scale)

    .controller('MidiOutputController', ['scale', '$scope', MidiOutputController])

    .directive('midiOutput', midiOutput);
