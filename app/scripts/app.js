'use strict';

var angular = require('angular'),
    browser = require('./modules/browser/module.js'),
    contenteditable = require('./modules/contenteditable/module.js'),
    instruments = require('./modules/instruments/module.js'),
    midiOutput = require('./modules/midi-output/module.js'),
    midiOutputs = require('./modules/midi-outputs/module.js'),
    recording = require('./modules/recording/module.js'),
    registeringService = require('./services/registering.js'),
    sendingService = require('./services/sending.js'),
    userMedia = require('./modules/user-media/module.js');

module.exports = angular
    .module('provider', [
        browser.name,
        contenteditable.name,
        instruments.name,
        midiOutput.name,
        midiOutputs.name,
        recording.name,
        userMedia.name
    ])

    .service('registeringService', ['instrumentsService', 'userMediaService', registeringService])
    .service('sendingService', sendingService);
