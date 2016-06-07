var angular = require('angular'),
    userMediaService = require('./services/user-media.js');

module.exports = angular
    .module('user-media', [])

    .service('userMediaService', [ userMediaService ]);
