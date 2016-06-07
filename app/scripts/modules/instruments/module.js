var angular = require('angular'),
    instrumentsServiceProvider = require('./providers/instruments.js'),
    peerConnectingService = require('./services/peer-connecting.js');

module.exports = angular
    .module('instruments', [])

    .provider('instrumentsService', instrumentsServiceProvider)

    .service('peerConnectingService', [ peerConnectingService ]);
