import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WindowService } from './window.service';

const ICE_SERVERS = [ { urls: [
    'stun:stun.l.google.com:19302',
    'stun:stun1.l.google.com:19302',
    'stun:stun2.l.google.com:19302',
    'stun:stun3.l.google.com:19302',
    'stun:stun4.l.google.com:19302'
] } ];

// @todo Remove this again when Chrome supports the unprefixed RTCPeerConnection.
declare var webkitRTCPeerConnection: RTCPeerConnectionStatic;

@Injectable()
export class PeerConnectingService {

    private _window;

    constructor (windowService: WindowService) {
        this._window = windowService.nativeWindow;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * PeerConnectingService.
     */
    get isSupported () {
        if ('webkitRTCPeerConnection' in this._window) {
            const peerConnection = new webkitRTCPeerConnection({
                iceServers: [ { urls: 'stun:0' } ]
            });

            return 'createDataChannel' in peerConnection;
        }

        return false;
    }

    public connect (webSocketSubject): Observable<RTCDataChannel> {
        return Observable.create((observer) => {
            webSocketSubject
                .filter(({ generator, type }) => (generator !== undefined && type === 'request'))
                .subscribe({
                    complete () {
                        observer.complete();
                    },
                    next ({ generator }) {
                        const peerConnection = new webkitRTCPeerConnection({
                            iceServers: ICE_SERVERS
                        });

                        const dataChannel = peerConnection.createDataChannel('channel-x', {
                            ordered: true
                        });

                        const candidateChannel = webSocketSubject
                            .mask({ generator, type: 'candidate' });

                        const descriptionChannel = webSocketSubject
                            .mask({ generator, type: 'description' });

                        const candidateChannelSubscription = candidateChannel
                            .subscribe(({ candidate }) => peerConnection
                                .addIceCandidate(new RTCIceCandidate(candidate))
                                .catch(() => {
                                    // Errors can be ignored.
                                }));

                        const descriptionChannelSubscription = descriptionChannel
                            .subscribe(({ description }) => peerConnection
                                .setRemoteDescription(new RTCSessionDescription(description))
                                .catch(() => {
                                    // @todo Handle this error and maybe request another description.
                                }));

                        dataChannel.onopen = () => {
                            candidateChannelSubscription.unsubscribe();
                            descriptionChannelSubscription.unsubscribe();

                            observer.next(dataChannel);
                        };

                        peerConnection.onicecandidate = ({ candidate }) => {
                            if (candidate) {
                                candidateChannel.send({ candidate });
                            }
                        };

                        peerConnection
                            .createOffer()
                            .then((description) => {
                                peerConnection
                                    .setLocalDescription(description)
                                    .catch(() => {
                                        // @todo Handle this error and maybe create another offer.
                                    });

                                descriptionChannel.send({ description });
                            })
                            .catch(() => {
                                // @todo Handle this error and maybe create another offer.
                            });
                    }
                });
        });
    }

}
