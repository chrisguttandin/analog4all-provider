'use strict';

var angular = require('angular'),
    userMediaServiceProvider = require('./providers/user-media.js');

module.exports = angular
    .module('user-media', [])

    .provider('userMediaService', userMediaServiceProvider);
