'use strict';

var angular = require('angular'),
    contenteditable = require('./directives/contenteditable.js');

module.exports = angular
    .module('contenteditable', [])

    .directive('contenteditable', ['$parse', contenteditable]);
