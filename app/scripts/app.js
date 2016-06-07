var angular = require('angular'),
    angularRoute = require('angular-route'),
    contenteditable = require('./modules/contenteditable/module.js'),
    fileReceivingService = require('./services/file-receiving.js'),
    fileSendingService = require('./services/file-sending.js'),
    instruments = require('./modules/instruments/module.js'),
    peerConnectingService = require('./services/peer-connecting.js'),
    provider = require('./modules/provider/module.js'),
    recording = require('./modules/recording/module.js'),
    registeringService = require('./services/registering.js'),
    samples = require('./modules/samples/module.js'),
    userMedia = require('./modules/user-media/module.js');

module.exports = angular
    .module('app', [
        angularRoute,
        contenteditable.name,
        instruments.name,
        provider.name,
        recording.name,
        samples.name,
        userMedia.name
    ])

    .config([ '$routeProvider', ($routeProvider) => $routeProvider.otherwise({ redirectTo: '/devices' }) ])

    .service('fileReceivingService', [fileReceivingService])
    .service('fileSendingService', [fileSendingService])
    .service('peerConnectingService', [peerConnectingService])
    .service('registeringService', ['instrumentsService', 'userMediaService', registeringService]);
