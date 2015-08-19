'use strict';

class Instruments {

    constructor (channelBrokerFactoryService, $http, peerConnectingService) {
        this._channelBrokerFactoryService = channelBrokerFactoryService;
        this._$http = $http;
        this._peerConnectingService = peerConnectingService;
    }

    connect (instrument) {
        var channelBroker,
            socket;

        socket = new WebSocket('ws://analog4all-registry.elasticbeanstalk.com/instruments/' + instrument.id);
        channelBroker = this._channelBrokerFactoryService.create({
            channel: socket
        });

        return this._peerConnectingService.connect(channelBroker);
    }

    create (data) {
        return new Promise((resolve, reject) => {
            this._$http
                .post('http://analog4all-registry.elasticbeanstalk.com/instruments', data)
                .success((data) => resolve(data))
                .error((data, status, headers, config) => {
                    console.log('error while creating an instrument', data, status, headers, config);

                    reject();
                });
        });
    }

    delete (id) {
        return new Promise((resolve, reject) => {
            this._$http
                .delete('http://analog4all-registry.elasticbeanstalk.com/instruments/' + id)
                .success(() => resolve())
                .error((data, status, headers, config) => {
                    console.log('error while deleting an instrument', data, status, headers, config);

                    reject();
                });
        });
    }

}

module.exports = Instruments;
