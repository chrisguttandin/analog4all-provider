import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IDataChannel, connect, isSupported } from 'rxjs-broker';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { IInstrument } from '../interfaces';
import { ADD_INSTRUMENT, DELETE_INSTRUMENT, IAppState, UPDATE_INSTRUMENT } from '../store';
import { ENDPOINT } from './endpoint-token';
import { PeerConnectingService } from './peer-connecting.service';
import { ResponseError } from './response-error';

@Injectable()
export class InstrumentsService {

    constructor (
        @Inject(ENDPOINT) private _endpoint: string,
        private _httpClient: HttpClient,
        private _peerConnectingService: PeerConnectingService,
        private _store: Store<IAppState>
    ) { }

    get isSupported () {
        return isSupported;
    }

    public connect ({ id }: { id: string }): Observable<IDataChannel> {
        const webSocketSubject = connect(`wss${ this._endpoint }instruments/${ id }`);

        return this._peerConnectingService.connect(webSocketSubject);
    }

    public create (instrument: object): Observable<IInstrument> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this._httpClient
            .post(`https${ this._endpoint }instruments`, JSON.stringify(instrument), { headers })
            .pipe(
                tap((nstrmnt) => this._store.dispatch({ payload: nstrmnt, type: ADD_INSTRUMENT })),
                catchError((response) => Observable.throw(new ResponseError(response)))
            );
    }

    public delete (instrument: IInstrument): Observable<null> {
        return this._httpClient
            .delete(`https${ this._endpoint }instruments/${ instrument.id }`)
            .pipe(
                map(() => null),
                tap(() => this._store.dispatch({ payload: instrument, type: DELETE_INSTRUMENT })),
                catchError((response) => Observable.throw(new ResponseError(response)))
            );
    }

    public select (id: string): Observable<null | IInstrument> {
        return this._store
            .select('instruments')
            .pipe(
                map<IInstrument[], undefined | IInstrument>((instruments) => instruments.find(({ id: d }) => id === d)),
                map<undefined | IInstrument, null | IInstrument>((instrument) => (instrument === undefined) ? null : instrument)
            );
    }

    public update (id: string, delta: object): Observable<null> {
        return this._httpClient
            .patch(`https${ this._endpoint }instruments/${ id }`, delta)
            .pipe(
                map(() => null),
                tap(() => this._store.dispatch({ payload: Object.assign({}, delta, { id }), type: UPDATE_INSTRUMENT })),
                catchError((response) => Observable.throw(new ResponseError(response)))
            );
    }

}
