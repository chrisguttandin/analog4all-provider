import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { IDataChannel, connect, isSupported } from 'rxjs-broker';
import { catchError, tap } from 'rxjs/operators';
import { TAppState, TInstrument, addInstrument } from '../store';
import { ENDPOINT } from './endpoint-token';
import { PeerConnectingService } from './peer-connecting.service';
import { ResponseError } from './response-error';

@Injectable({
    providedIn: 'root'
})
export class InstrumentsService {

    constructor (
        @Inject(ENDPOINT) private _endpoint: string,
        private _httpClient: HttpClient,
        private _peerConnectingService: PeerConnectingService,
        private _store: Store<TAppState>
    ) { }

    get isSupported (): boolean {
        return isSupported;
    }

    public connect ({ socket: { url } }: TInstrument): Observable<IDataChannel> {
        const webSocketSubject = connect(url); // tslint:disable-line:no-null-undefined-union

        return this._peerConnectingService.connect(webSocketSubject);
    }

    public create (instrument: object): Observable<TInstrument> {
        return this._httpClient
            .post<TInstrument>(`https${ this._endpoint }instruments`, instrument)
            .pipe(
                tap((nstrmnt) => this._store.dispatch(addInstrument(nstrmnt))),
                catchError((response) => throwError(new ResponseError(response)))
            );
    }

}
