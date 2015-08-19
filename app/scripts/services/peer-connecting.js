'use strict';

class PeerConnectingService {

    constructor (peerConnectorFactoryService) {
        this._peerConnectorFactoryService = peerConnectorFactoryService;
    }

    connect (channelBroker) {
        /* eslint-disable indent */
        var peerConnector = this._peerConnectorFactoryService.create({
                channelBroker: channelBroker
            });
        /* eslint-enable indent */

        channelBroker.addErrorHandler(::peerConnector.fail);
        channelBroker.addMessageHandler(::peerConnector.handle);

        return peerConnector;
    }

}

module.exports = PeerConnectingService;
