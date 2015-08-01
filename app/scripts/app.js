'use strict';

var angular = require('angular'),
    angularRoute = require('angular-route'),
    browser = require('./modules/browser/module.js'),
    contenteditable = require('./modules/contenteditable/module.js'),
    instruments = require('./modules/instruments/module.js'),
    midiOutput = require('./modules/midi-output/module.js'),
    midiOutputs = require('./modules/midi-outputs/module.js'),
    readFileSync = require('fs').readFileSync,
    recording = require('./modules/recording/module.js'),
    registeringService = require('./services/registering.js'),
    sendingService = require('./services/sending.js'),
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

    .service('registeringService', ['instrumentsService', 'userMediaService', registeringService])
    .service('sendingService', sendingService);
