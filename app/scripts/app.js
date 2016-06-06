var angular = require('angular'),
    angularRoute = require('angular-route'),
    browser = require('./modules/browser/module.js'),
    contenteditable = require('./modules/contenteditable/module.js'),
    fileReceivingService = require('./services/file-receiving.js'),
    fileSendingService = require('./services/file-sending.js'),
    instruments = require('./modules/instruments/module.js'),
    midiOutput = require('./modules/midi-output/module.js'),
    midiOutputs = require('./modules/midi-outputs/module.js'),
    peerConnectingService = require('./services/peer-connecting.js'),
    readFileSync = require('fs').readFileSync,
    recording = require('./modules/recording/module.js'),
    registeringService = require('./services/registering.js'),
    samples = require('./modules/samples/module.js'),
    userMedia = require('./modules/user-media/module.js');

module.exports = angular
    .module('provider', [
        angularRoute,
        browser.name,
        contenteditable.name,
        instruments.name,
        midiOutput.name,
        midiOutputs.name,
        recording.name,
        samples.name,
        userMedia.name
    ])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/devices', {
                controller: class DevicesController {},
                template: readFileSync(__dirname + '/../views/devices.html', 'utf8')
            })
            .when('/devices/:deviceId', {
                controller: class DeviceController {},
                template: readFileSync(__dirname + '/../views/device.html', 'utf8')
            })
            .otherwise({
                redirectTo: '/devices'
            });
    }])

    .service('fileReceivingService', [fileReceivingService])
    .service('fileSendingService', [fileSendingService])
    .service('peerConnectingService', [peerConnectingService])
    .service('registeringService', ['instrumentsService', 'userMediaService', registeringService]);
