var angular = require('angular'),
    instrumentsService = require('./services/instruments.js'),
    peerConnectingService = require('./services/peer-connecting.js');

module.exports = angular
    .module('instruments', [])

    .service('instrumentsService', [ '$http', 'peerConnectingService', instrumentsService ])
    .service('peerConnectingService', [ peerConnectingService ]);
