'use strict';

var InstrumentsService = require('../services/instruments.js');

class InstrumentsServiceProvider {

    /**
     * This property is true if the browser supports all the required APIs to use the
     * InstrumentsService. The code is roughly copied from [Modernizr's feature detection tests]
     * {@link https://github.com/Modernizr/Modernizr/blob/master/feature-detects/}
     */
    get isSupported () {
        if ('WebSocket' in window && 'webkitRTCPeerConnection' in window) {
            let peerConnection = new webkitRTCPeerConnection({
                    iceServers: [{ url: 'stun:0' }]
                });

            return 'createDataChannel' in peerConnection;
        }

        return false;
    }

    get $get () {
        return ['$http', function ($http) {
            return new InstrumentsService($http);
        }];
    }

}

module.exports = InstrumentsServiceProvider;
