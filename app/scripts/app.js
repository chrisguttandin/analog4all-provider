'use strict';

var angular = require('angular'),
    angularRoute = require('angular-route'),
    browser = require('./modules/browser/module.js'),
    channelBrokerFactoryService = require('./services/channel-broker-factory.js'),
    contenteditable = require('./modules/contenteditable/module.js'),
    fileReceiverFactoryService = require('./services/file-receiver-factory.js'),
    fileReceivingService = require('./services/file-receiving.js'),
    fileSenderFactoryService = require('./services/file-sender-factory.js'),
    fileSendingService = require('./services/file-sending.js'),
    instruments = require('./modules/instruments/module.js'),
    midiOutput = require('./modules/midi-output/module.js'),
    midiOutputs = require('./modules/midi-outputs/module.js'),
    readFileSync = require('fs').readFileSync,
    recording = require('./modules/recording/module.js'),
    registeringService = require('./services/registering.js'),
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
        userMedia.name
    ])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/devices', {
                controller: function () {},
                template: readFileSync(__dirname + '/../views/devices.html', 'utf8')
            })
            .when('/devices/:deviceId', {
                controller: function () {},
                template: readFileSync(__dirname + '/../views/device.html', 'utf8')
            })
            .otherwise({
                redirectTo: '/devices'
            });
    }])

    .service('channelBrokerFactoryService', [channelBrokerFactoryService])
    .service('fileReceiverFactoryService', [fileReceiverFactoryService])
    .service('fileReceivingService', ['fileReceiverFactoryService', fileReceivingService])
    .service('fileSenderFactoryService', [fileSenderFactoryService])
    .service('fileSendingService', ['fileSenderFactoryService', fileSendingService])
    .service('registeringService', ['instrumentsService', 'userMediaService', registeringService]);
