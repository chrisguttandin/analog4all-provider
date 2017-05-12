import { Inject, Injectable } from '@angular/core';
import { IDataChannel } from 'rxjs-broker';
import { Observable } from 'rxjs/Observable';
import { WindowService } from './window.service';

const ICE_SERVERS = [ { urls: [
    'stun:stun.l.google.com:19302',
    'stun:stun1.l.google.com:19302',
    'stun:stun2.l.google.com:19302',
    'stun:stun3.l.google.com:19302',
    'stun:stun4.l.google.com:19302'
] } ];

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
        if ('RTCPeerConnection' in this._window) {
            const peerConnection = new RTCPeerConnection({
                iceServers: [ { urls: 'stun:0' } ]
            });

            return 'createDataChannel' in peerConnection;
        }

        return false;
    }

    public connect (webSocketSubject): Observable<IDataChannel> {
        return Observable.create((observer) => {
            webSocketSubject
                .filter(({ generator, type }) => (generator !== undefined && type === 'request'))
                .subscribe({
                    complete () {
                        observer.complete();
                    },
                    next ({ generator }) {
                        const peerConnection = new RTCPeerConnection({
                            iceServers: ICE_SERVERS
                        });

                        // @todo Casting peerConnection to any should not be necessary forever.
                        const dataChannel: IDataChannel = (<any> peerConnection).createDataChannel('channel-x', {
                            ordered: true
                        });

                        const candidateSubject = webSocketSubject
                            .mask({ generator, type: 'candidate' });

                        const descriptionSubject = webSocketSubject
                            .mask({ generator, type: 'description' });

                        const candidateSubjectSubscription = candidateSubject
                            .subscribe(({ candidate }) => peerConnection
                                .addIceCandidate(new RTCIceCandidate(candidate))
                                .catch(() => {
                                    // Errors can be ignored.
                                }));

                        const descriptionSubjectSubscription = descriptionSubject
                            .subscribe(({ description }) => peerConnection
                                .setRemoteDescription(new RTCSessionDescription(description))
                                .catch(() => {
                                    // @todo Handle this error and maybe request another description.
                                }));

                        dataChannel.addEventListener('open', () => {
                            candidateSubjectSubscription.unsubscribe();
                            descriptionSubjectSubscription.unsubscribe();

                            observer.next(dataChannel);
                        });

                        peerConnection.addEventListener('icecandidate', ({ candidate }: RTCPeerConnectionIceEvent) => {
                            if (candidate) {
                                candidateSubject.send({ candidate });
                            }
                        });

                        peerConnection
                            .createOffer()
                            .then((description) => {
                                peerConnection
                                    .setLocalDescription(description)
                                    .catch(() => {
                                        // @todo Handle this error and maybe create another offer.
                                    });

                                descriptionSubject.send({ description });
                            })
                            .catch(() => {
                                // @todo Handle this error and maybe create another offer.
                            });
                    }
                });
        });
    }

}
