import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { connect, isSupported } from 'rxjs-broker';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { IInstrument } from '../interfaces';
import { ADD_INSTRUMENT, DELETE_INSTRUMENT, IAppState, UPDATE_INSTRUMENT } from '../store';
import { ENDPOINT } from './endpoint-token';
import { PeerConnectingService } from './peer-connecting.service';
import { ResponseError } from './response-error';

@Injectable()
export class InstrumentsService {

    constructor (
        @Inject(ENDPOINT) private _endpoint,
        private _http: Http,
        private _peerConnectingService: PeerConnectingService,
        private _store: Store<IAppState>
    ) { }

    get isSupported () {
        return isSupported;
    }

    public connect ({ id }): Observable<RTCDataChannel> {
        const webSocketSubject = connect(`wss${ this._endpoint }instruments/${ id }`);

        return this._peerConnectingService.connect(webSocketSubject);
    }

    public create (instrument): Observable<IInstrument> {
        const headers = new Headers();

        headers.set('Content-Type', 'application/json');

        return this._http
            .post(`https${ this._endpoint }instruments`, JSON.stringify(instrument), { headers })
            .map((response) => response.json())
            .do((nstrmnt) => this._store.dispatch({ payload: nstrmnt, type: ADD_INSTRUMENT }))
            .catch((response) => Observable.throw(new ResponseError(response)));
    }

    public delete (instrument: IInstrument): Observable<null> {
        return this._http
            .delete(`https${ this._endpoint }instruments/${ instrument.id }`)
            .map(() => null)
            .do(() => this._store.dispatch({ payload: instrument, type: DELETE_INSTRUMENT }))
            .catch((response) => Observable.throw(new ResponseError(response)));
    }

    public select (id: string): Observable<IInstrument> {
        return this._store
            .select('instruments')
            .map((instruments: IInstrument[]) => instruments.find(({ id: d }) => id === d))
            .map((instrument) => (instrument === undefined) ? null : instrument);
    }

    public update (id: string, delta): Observable<null> {
        return this._http
            .patch(`https${ this._endpoint }instruments/${ id }`, delta)
            .map(() => null)
            .do(() => this._store.dispatch({ payload: Object.assign({}, delta, { id }), type: UPDATE_INSTRUMENT }))
            .catch((response) => Observable.throw(new ResponseError(response)));
    }

}
