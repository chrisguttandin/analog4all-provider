var angular = require('angular'),
    recordingService = require('./services/recording.js'),
    userMedia = require('../user-media/module.js');

module.exports = angular
    .module('recordingService', [
        userMedia.name
    ])

    .service('recordingService', [ 'userMediaService', recordingService ]);
