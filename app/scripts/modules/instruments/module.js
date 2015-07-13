'use strict';

var angular = require('angular'),
    instrumentsServiceProvider = require('./providers/instruments.js');

module.exports = angular
    .module('instruments', [])

    .provider('instrumentsService', instrumentsServiceProvider);
