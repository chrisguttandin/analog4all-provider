var EventEmitter = require('events').EventEmitter;

/* eslint-disable indent */
const ICE_SERVERS = [{
          url: 'stun:stun.l.google.com:19302'
      }, {
          url: 'stun:stun1.l.google.com:19302'
      }, {
          url: 'stun:stun2.l.google.com:19302'
      }, {
          url: 'stun:stun3.l.google.com:19302'
      }, {
          url: 'stun:stun4.l.google.com:19302'
      }];
/* eslint-enable indent */

class PeerConnector extends EventEmitter {

    constructor (options) {
        super();

        this._channelBroker = options.channelBroker;
        this._channelBrokerFactoryService = options.channelBrokerFactoryService;
        this._generators = new Map();
    }

    async fail (err) {
        // @todo close the peerConnection

        throw err;
    }

    async handle (message) {
        if (message.type === 'candidate') {
            let candidate = new RTCIceCandidate(message.candidate),
                context = this._generators.get(message.generator.id);

            context.peerConnection.addIceCandidate(candidate, function () {}, function () {
                // shit happens
            });
        } else if (message.type === 'description') {
            let context = this._generators.get(message.generator.id),
                description = new RTCSessionDescription(message.description);

            context.peerConnection.setRemoteDescription(description);
        } else if (message.type === 'request') {
            let dataChannel,
                generator,
                peerConnection;

            generator = message.generator;

            peerConnection = new webkitRTCPeerConnection({ // eslint-disable-line new-cap, no-undef
                iceServers: ICE_SERVERS
            });

            dataChannel = peerConnection.createDataChannel('channel-x', {
                ordered: true
            });

            this._generators.set(generator.id, {
                generator,
                peerConnection
            });

            dataChannel.onerror = () => {
                this._generators.delete(generator.id);
            };

            dataChannel.onopen = () => {
                dataChannel.onopen = null;
                dataChannel.onerror = null;

                dataChannel.addEventListener('close', () => {
                    this._generators.delete(generator.id);
                });

                this.emit('channel', this._channelBrokerFactoryService.create({
                    channel: dataChannel
                }));
            };

            peerConnection.onicecandidate = (event) => {
                var candidate = event.candidate;

                if (candidate) {
                    this._channelBroker.send({
                        candidate: candidate.toJSON(),
                        generator: {
                            id: generator.id
                        },
                        type: 'candidate'
                    });
                }
            };

            // @todo peerConnection.onerror
            // @todo peerConnection.oniceconnectionstatechange
            // @todo peerConnection.onsignalingstatechange

            peerConnection.createOffer((description) => {
                peerConnection.setLocalDescription(description);

                this._channelBroker.send({
                    description: description.toJSON(),
                    generator: {
                        id: generator.id
                    },
                    type: 'description'
                });
            }, function () {
                // shit happens
            });
        } else {
            throw new Error();
        }
    }

}

class PeerConnectorFactoryService {

    constructor (channelBrokerFactoryService) {
        this._channelBrokerFactoryService = channelBrokerFactoryService;
    }

    create (options) {
        options.channelBrokerFactoryService = this._channelBrokerFactoryService;

        return new PeerConnector(options);
    }

}

module.exports = PeerConnectorFactoryService;
