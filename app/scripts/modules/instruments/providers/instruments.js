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
            /* eslint-disable indent */
            let peerConnection = new webkitRTCPeerConnection({ // eslint-disable-line new-cap, no-undef
                    iceServers: [{ url: 'stun:0' }]
                });
            /* eslint-enable indent */

            return 'createDataChannel' in peerConnection;
        }

        return false;
    }

    get $get () {
        return ['channelBrokerFactoryService', '$http', 'peerConnectingService', function (channelBrokerFactoryService, $http, peerConnectingService) {
            return new InstrumentsService(channelBrokerFactoryService, $http, peerConnectingService);
        }];
    }

}

module.exports = InstrumentsServiceProvider;
