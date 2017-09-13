import { Injectable } from '@angular/core';
import { IDataChannel, IMaskableSubject, IStringifyableJsonObject } from 'rxjs-broker';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ICandidateSubjectEvent, IDescriptionSubjectEvent } from '../interfaces';
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

    private _window: Window;

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

    public connect (webSocketSubject: IMaskableSubject<IStringifyableJsonObject>): Observable<IDataChannel> {
        return Observable.create((observer: Observer<IDataChannel>) => {
            webSocketSubject
                .filter(({ generator, type }) => (generator !== undefined && type === 'request'))
                .subscribe({
                    complete () {
                        observer.complete();
                    },
                    next () {
                        const peerConnection = new RTCPeerConnection({
                            iceServers: ICE_SERVERS
                        });

                        // @todo Casting peerConnection to any should not be necessary forever.
                        const dataChannel: IDataChannel = (<any> peerConnection).createDataChannel('channel-x', {
                            ordered: true
                        });

                        const candidateSubject = webSocketSubject
                            .mask<ICandidateSubjectEvent>({ type: 'candidate' });

                        const descriptionSubject = webSocketSubject
                            .mask<IDescriptionSubjectEvent>({ type: 'description' });

                        const candidateSubjectSubscription = candidateSubject
                            .subscribe(({ candidate }) => peerConnection
                                // @todo Remove casting again when possible.
                                .addIceCandidate(new RTCIceCandidate(<any> candidate))
                                .catch(() => {
                                    // Errors can be ignored.
                                }));

                        const descriptionSubjectSubscription = descriptionSubject
                            .subscribe(({ description }) => peerConnection
                                // @todo Remove casting again when possible.
                                .setRemoteDescription(new RTCSessionDescription(<any> description))
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
