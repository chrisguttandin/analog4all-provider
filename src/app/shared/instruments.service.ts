import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { connect, isSupported } from 'rxjs-broker';
import { TAppState, TInstrument, addInstrument } from '../store';
import { TWebSocketEvent } from '../types';
import { ENDPOINT } from './endpoint-token';
import { PeerConnectingService } from './peer-connecting.service';
import { ResponseError } from './response-error';

@Injectable({
    providedIn: 'root'
})
export class InstrumentsService {
    constructor(
        @Inject(ENDPOINT) private _endpoint: string,
        private _httpClient: HttpClient,
        private _peerConnectingService: PeerConnectingService,
        private _store: Store<TAppState>
    ) {}

    // eslint-disable-next-line class-methods-use-this
    public get isSupported(): boolean {
        return isSupported;
    }

    public connect({ socket: { url } }: TInstrument): Observable<RTCDataChannel> {
        const webSocketSubject = connect<TWebSocketEvent>(url);

        return this._peerConnectingService.connect(webSocketSubject);
    }

    public create(instrument: {
        description?: string;
        gearogsSlug?: string;
        name: string;
        soundCloudUsername?: string;
    }): Observable<TInstrument> {
        return this._httpClient.post<TInstrument>(`https${this._endpoint}instruments`, instrument).pipe(
            tap((nstrmnt) => this._store.dispatch(addInstrument(nstrmnt))),
            catchError((response) => throwError(new ResponseError(response)))
        );
    }
}
