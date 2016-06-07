var angular = require('angular'),
    browserService = require('./services/browser.js'),
    instruments = require('../instruments/module.js'),
    userMedia = require('../user-media/module.js');

module.exports = angular
    .module('browser', [
        instruments.name,
        userMedia.name
    ])

    .service('browserService', [ 'instrumentsService', 'userMediaService', browserService ]);
