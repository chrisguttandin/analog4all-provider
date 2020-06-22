import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { IRemoteSubject, mask } from 'rxjs-broker';
import { mergeMap } from 'rxjs/operators';
import {
    ICandidateEvent,
    ICandidateMessage,
    IClientEvent,
    IDescriptionEvent,
    IDescriptionMessage,
    IRequestEvent,
    IRequestMessage
} from '../interfaces';
import { TWebSocketEvent } from '../types';
import { WindowService } from './window.service';

const ICE_SERVERS = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];

@Injectable({
    providedIn: 'root'
})
export class PeerConnectingService {
    private _window: null | Window;

    constructor(windowService: WindowService) {
        this._window = windowService.nativeWindow;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * PeerConnectingService.
     */
    get isSupported(): boolean {
        if (this._window !== null && 'RTCPeerConnection' in this._window) {
            const peerConnection = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:0' }]
            });

            return 'createDataChannel' in peerConnection;
        }

        return false;
    }

    public connect(webSocketSubject: IRemoteSubject<TWebSocketEvent>): Observable<RTCDataChannel> {
        // tslint:disable-line:max-line-length no-null-undefined-union
        return new Observable((observer: Observer<RTCDataChannel>) => {
            mask<IRequestMessage, IRequestEvent, TWebSocketEvent>({ type: 'request' }, webSocketSubject)
                .pipe(
                    mergeMap(
                        ({ mask: msk }) =>
                            new Observable<RTCDataChannel>((bsrvr) => {
                                const maskedWebSocketSubject: IRemoteSubject<IClientEvent['message']> = mask(msk, webSocketSubject); // tslint:disable-line:max-line-length no-null-undefined-union

                                const peerConnection = new RTCPeerConnection({
                                    iceServers: ICE_SERVERS
                                });

                                const dataChannel = peerConnection.createDataChannel('channel-x', { ordered: true });

                                const candidateSubject = mask<ICandidateMessage, ICandidateEvent, IClientEvent['message']>(
                                    { type: 'candidate' },
                                    maskedWebSocketSubject
                                );
                                const descriptionSubject = mask<IDescriptionMessage, IDescriptionEvent, IClientEvent['message']>(
                                    { type: 'description' },
                                    maskedWebSocketSubject
                                );

                                const candidateSubjectSubscription = candidateSubject.subscribe(({ candidate }) =>
                                    peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {
                                        // Errors can be ignored.
                                    })
                                );

                                const descriptionSubjectSubscription = descriptionSubject.subscribe(({ description }) =>
                                    peerConnection.setRemoteDescription(new RTCSessionDescription(description)).catch(() => {
                                        // @todo Handle this error and maybe request another description.
                                    })
                                );

                                dataChannel.addEventListener('open', () => {
                                    candidateSubjectSubscription.unsubscribe();
                                    descriptionSubjectSubscription.unsubscribe();

                                    bsrvr.next(dataChannel);
                                    bsrvr.complete();
                                });

                                peerConnection.addEventListener('icecandidate', ({ candidate }) => {
                                    if (candidate !== null) {
                                        candidateSubject.send(<ICandidateMessage>{ candidate });
                                    }
                                });

                                peerConnection.addEventListener('negotiationneeded', () => {
                                    peerConnection
                                        .createOffer()
                                        .then((description) => {
                                            peerConnection.setLocalDescription(description).catch(() => {
                                                // @todo Handle this error and maybe create another offer.
                                            });

                                            // @todo Remove casting again when possible.
                                            descriptionSubject.send(<IDescriptionMessage>{ description });
                                        })
                                        .catch(() => {
                                            // @todo Handle this error and maybe create another offer.
                                        });
                                });
                            })
                    )
                )
                .subscribe(observer);
        });
    }
}
