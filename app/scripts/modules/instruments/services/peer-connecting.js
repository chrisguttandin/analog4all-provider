import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operator/filter';

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

export class PeerConnectingService {

    connect (webSocketSubject) {
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
                            .mask({ generator, type: 'candidate' })

                        descriptionChannel = webSocketSubject
                            .mask({ generator, type: 'description' })

                        candidateChannelSubscription = candidateChannel
                            .subscribe({
                                next ({ candidate }) {
                                    peerConnection.addIceCandidate(new RTCIceCandidate(candidate), () => {}, () => {
                                        // shit happens
                                    });
                                }
                            });

                        descriptionChannelSubscription = descriptionChannel
                            .subscribe({
                                next ({ description }) {
                                    peerConnection.setRemoteDescription(new RTCSessionDescription(description));
                                }
                            });

                        peerConnection.onicecandidate = ({ candidate }) => {
                            if (candidate) {
                                candidateChannel.send({ candidate: candidate.toJSON() });
                            }
                        };

                        peerConnection.createOffer((description) => {
                            peerConnection.setLocalDescription(description);

                            descriptionChannel.send({ description: description.toJSON() });
                        }, () => {
                            // shit happens
                        });
                    }
                });
        });
    }

}
