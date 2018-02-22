import { Injectable } from '@angular/core';
import { IDataChannel, IMaskableSubject, TStringifyableJsonValue } from 'rxjs-broker';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { mergeMap } from 'rxjs/operators';
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

    private _window: null | Window;

    constructor (windowService: WindowService) {
        this._window = windowService.nativeWindow;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * PeerConnectingService.
     */
    get isSupported () {
        if (this._window !== null && 'RTCPeerConnection' in this._window) {
            const peerConnection = new RTCPeerConnection({
                iceServers: [ { urls: 'stun:0' } ]
            });

            return 'createDataChannel' in peerConnection;
        }

        return false;
    }

    public connect (webSocketSubject: IMaskableSubject<TStringifyableJsonValue>): Observable<IDataChannel> {
        return new Observable((observer: Observer<IDataChannel>) => {
            webSocketSubject
                .mask<any>({ type: 'request' })
                .pipe(
                    mergeMap(({ mask }) => new Observable<IDataChannel>((bsrvr) => {
                        const maskedWebSocketSubject = webSocketSubject.mask(mask);

                        const peerConnection = new RTCPeerConnection({
                            iceServers: ICE_SERVERS
                        });

                        // @todo Casting peerConnection to any should not be necessary forever.
                        const dataChannel: IDataChannel = (<any> peerConnection).createDataChannel('channel-x', {
                            ordered: true
                        });

                        const candidateSubject = maskedWebSocketSubject
                            .mask<ICandidateSubjectEvent>({ type: 'candidate' });

                        const descriptionSubject = maskedWebSocketSubject
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

                            bsrvr.next(dataChannel);
                            bsrvr.complete();
                        });

                        peerConnection.addEventListener('icecandidate', ({ candidate }) => {
                            if (candidate) {
                                candidateSubject.send({ candidate });
                            }
                        });

                        peerConnection.addEventListener('negotiationneeded', () => {
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
                        });
                    }))
                )
                .subscribe(observer);
        });
    }

}
