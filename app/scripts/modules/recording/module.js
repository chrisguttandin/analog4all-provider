var angular = require('angular'),
    recordingService = require('./services/recording.js');

module.exports = angular
    .module('recordingService', [])

    .service('recordingService', ['userMediaService', recordingService]);
