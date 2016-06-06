var angular = require('angular'),
    angularRoute = require('angular-route'),
    browser = require('./modules/browser/module.js'),
    contenteditable = require('./modules/contenteditable/module.js'),
    fileReceivingService = require('./services/file-receiving.js'),
    fileSendingService = require('./services/file-sending.js'),
    instruments = require('./modules/instruments/module.js'),
    localRegistry = require('./modules/local-registry/module.js'),
    midiOutput = require('./modules/midi-output/module.js'),
    peerConnectingService = require('./services/peer-connecting.js'),
    recording = require('./modules/recording/module.js'),
    registeringService = require('./services/registering.js'),
    samples = require('./modules/samples/module.js'),
    slot = require('./modules/slot/module.js'),
    userMedia = require('./modules/user-media/module.js');

module.exports = angular
    .module('provider', [
        angularRoute,
        browser.name,
        contenteditable.name,
        instruments.name,
        localRegistry.name,
        midiOutput.name,
        recording.name,
        samples.name,
        slot.name,
        userMedia.name
    ])

    .config([ '$routeProvider', ($routeProvider) => $routeProvider.otherwise({ redirectTo: '/devices' }) ])

    .service('fileReceivingService', [fileReceivingService])
    .service('fileSendingService', [fileSendingService])
    .service('peerConnectingService', [peerConnectingService])
    .service('registeringService', ['instrumentsService', 'userMediaService', registeringService]);
