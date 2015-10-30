'use strict';

var angular = require('angular'),
    samplesService = require('./services/samples.js');

module.exports = angular
    .module('samples', [])

    .service('samplesService', ['$http', samplesService]);
