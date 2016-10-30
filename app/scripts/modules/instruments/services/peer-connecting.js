import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operator/filter';

/* eslint-disable indent */
const ICE_SERVERS = [ { urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302'
      ] } ];
/* eslint-enable indent */

export class PeerConnectingService {

    connect (webSocketSubject) { // eslint-disable-line class-methods-use-this
        return new Observable((observer) => {
            webSocketSubject
                ::filter((message) => (message.type === 'request' && message.generator !== undefined))
                .subscribe({
                    complete () {
                        observer.complete();
                    },
                    next ({ generator }) {
                        var candidateChannel,
                            candidateChannelSubscription,
                            dataChannel,
                            descriptionChannel,
                            descriptionChannelSubscription,
                            peerConnection;

                        peerConnection = new webkitRTCPeerConnection({ // eslint-disable-line new-cap, no-undef
                            iceServers: ICE_SERVERS
                        });

                        dataChannel = peerConnection.createDataChannel('channel-x', {
                            ordered: true
                        });

                        dataChannel.onopen = () => {
                            candidateChannelSubscription.unsubscribe();
                            descriptionChannelSubscription.unsubscribe();

                            observer.next(dataChannel);
                        };

                        candidateChannel = webSocketSubject
                            .mask({ generator, type: 'candidate' });

                        descriptionChannel = webSocketSubject
                            .mask({ generator, type: 'description' });

                        candidateChannelSubscription = candidateChannel
                            .subscribe({
                                next ({ candidate }) {
                                    peerConnection
                                        .addIceCandidate(new RTCIceCandidate(candidate))
                                        .catch(() => {
                                            // shit happens
                                        });
                                }
                            });

                        descriptionChannelSubscription = descriptionChannel
                            .subscribe({
                                next ({ description }) {
                                    peerConnection
                                        .setRemoteDescription(new RTCSessionDescription(description))
                                        .catch(() => {
                                            // shit happens
                                        });
                                }
                            });

                        peerConnection.onicecandidate = ({ candidate }) => {
                            if (candidate) {
                                candidateChannel.send({ candidate: candidate.toJSON() });
                            }
                        };

                        peerConnection
                            .createOffer()
                            .then((description) => {
                                peerConnection
                                    .setLocalDescription(description)
                                    .catch(() => {
                                        // shit happens
                                    });

                                descriptionChannel.send({ description: description.toJSON() });
                            })
                            .catch(() => {
                                // shit happens
                            });
                    }
                });
        });
    }

}
