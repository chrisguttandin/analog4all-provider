'use strict';

var angular = require('angular'),
    midiOutput = require('./modules/midi-output/module.js'),
    midiOutputs = require('./modules/midi-outputs/module.js');

module.exports = angular
    .module('provider', [
        midiOutput.name,
        midiOutputs.name
    ]);
