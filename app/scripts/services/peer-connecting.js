'use strict';

class PeerConnectingService {

    constructor (peerConnectorFactoryService) {
        this._peerConnectorFactoryService = peerConnectorFactoryService;
    }

    connect (channelBroker) {
        var errorSubscription,
            messageSubscription,
            peerConnector;

        peerConnector = this._peerConnectorFactoryService.create({
            channelBroker: channelBroker
        });

        errorSubscription = channelBroker.addErrorHandler(::peerConnector.fail);
        messageSubscription = channelBroker.addMessageHandler(::peerConnector.handle);

        return peerConnector;
    }

}

module.exports = PeerConnectingService;
