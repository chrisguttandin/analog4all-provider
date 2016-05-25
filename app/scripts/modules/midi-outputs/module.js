var angular = require('angular'),
    midiOutputs = require('./directives/midi-outputs.js'),
    MidiOutputsController = require('./controllers/midi-outputs.js');

module.exports = angular
    .module('midiOutputs', [])

    .controller('MidiOutputsController', ['$scope', MidiOutputsController])

    .directive('midiOutputs', midiOutputs);
