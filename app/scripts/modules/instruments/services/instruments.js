'use strict';

var EventEmitter = require('events').EventEmitter;

class Instruments {

    constructor (channelBrokerFactoryService, $http) {
        this._channelBrokerFactoryService = channelBrokerFactoryService;
        this._$http = $http;
    }

    connect (instrument) {
        return new Promise((resolve, reject) => {
            var channelBrokerFactoryService = this._channelBrokerFactoryService,
                connection = new EventEmitter(),
                generators = new Map(),
                socket = new WebSocket('ws://analog4all-registry.elasticbeanstalk.com/instruments/' + instrument.id);

            socket.addEventListener('error', function (event) {
                console.log('error while establishing a socket connection', event);
            });

            socket.addEventListener('message', function (event) {
                var data = JSON.parse(event.data);

                if (data.type === 'candidate') {
                    let context = generators.get(data.generator.id);

                    context.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate, function () {}, function (err) {
                        console.log('error while adding an ICE candidate', err);
                    }));
                } else if (data.type === 'description') {
                    let context = generators.get(data.generator.id),
                        description = new RTCSessionDescription(data.description);

                    context.peerConnection.setRemoteDescription(description);
                } else if (data.type === 'request') {
                    let dataChannel,
                        generator,
                        peerConnection;

                    peerConnection = new webkitRTCPeerConnection({
                        iceServers: [{
                            url: 'stun:stun.l.google.com:19302'
                        }, {
                            url: 'stun:stun1.l.google.com:19302'
                        }, {
                            url: 'stun:stun2.l.google.com:19302'
                        }, {
                            url: 'stun:stun3.l.google.com:19302'
                        }, {
                            url: 'stun:stun4.l.google.com:19302'
                        }]
                    });

                    dataChannel = peerConnection.createDataChannel('channel-x', {
                        ordered: true
                    });

                    generator = data.generator;

                    generators.set(generator.id, {
                        generator: generator,
                        peerConnection: peerConnection
                    });

                    dataChannel.onerror = function () {
                        generators.delete(generator.id);
                    };

                    dataChannel.onopen = function () {
                        dataChannel.onopen = null;
                        dataChannel.onerror = null;

                        dataChannel.addEventListener('close', function () {
                            generators.delete(generator.id);
                        });

                        connection.emit('channel', channelBrokerFactoryService.create({
                            channel: dataChannel
                        }));
                    };

                    // @todo peerConnection.onerror

                    peerConnection.onicecandidate = function (event) {
                        if (event.candidate) {
                            socket.send(JSON.stringify({
                                candidate: event.candidate.toJSON(),
                                generator: {
                                    id: generator.id
                                },
                                type: 'candidate'
                            }));
                        }
                    };

                    peerConnection.createOffer(function (description) {
                        peerConnection.setLocalDescription(description);

                        socket.send(JSON.stringify({
                            description: description.toJSON(),
                            generator: {
                                id: data.generator.id
                            },
                            type: 'description'
                        }));
                    }, function (err) {
                        console.log('error while creating an offer', err);
                    });
                } else {
                    console.log('received message of an unknown type', event);
                }
            });

            socket.addEventListener('open', function () {
                resolve(connection);
            });
        });
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
