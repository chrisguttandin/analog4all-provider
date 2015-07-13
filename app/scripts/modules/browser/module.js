'use strict';

var angular = require('angular'),
    browser = require('./directives/browser.js'),
    BrowserController = require('./controllers/browser.js'),
    instruments = require('../instruments/module.js'),
    userMedia = require('../user-media/module.js');

module.exports = angular
    .module('browser', [
        instruments.name,
        userMedia.name
    ])

    .config(['$provide', 'instrumentsServiceProvider', 'userMediaServiceProvider', function ($provide, instrumentsServiceProvider, userMediaServiceProvider) {
        $provide.constant('isSupported', (instrumentsServiceProvider.isSupported && userMediaServiceProvider.isSupported));
    }])

    .controller('BrowserController', ['isSupported', BrowserController])

    .directive('browser', browser);
