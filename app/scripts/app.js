'use strict';

var angular = require('angular'),
    angularRoute = require('angular-route'),
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
                template: '<p ng-if="!(browser.isSupported)">Sorry, your browser is not supported. :-(</p><midi-outputs ng-if="browser.isSupported"></midi-outputs>',
            })
            .otherwise({
                redirectTo: '/devices'
            });
     }])

    .service('registeringService', ['instrumentsService', 'userMediaService', registeringService])
    .service('sendingService', sendingService);
