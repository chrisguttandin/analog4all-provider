import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IDataChannel, connect, isSupported } from 'rxjs-broker';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { IInstrument } from '../interfaces';
import { addInstrument, deleteInstrument, updateInstrument } from '../store/actions';
import { IAppState } from '../store/interfaces';
import { createInstrumentByIdSelector } from '../store/selectors';
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

    public connect ({ socket: { url } }: IInstrument): Observable<IDataChannel> {
        const webSocketSubject = connect(url);

        return this._peerConnectingService.connect(webSocketSubject);
    }

    public create (instrument: object): Observable<IInstrument> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this._httpClient
            .post<IInstrument>(`https${ this._endpoint }instruments`, JSON.stringify(instrument), { headers })
            .pipe(
                tap((nstrmnt) => this._store.dispatch(addInstrument(nstrmnt))),
                catchError((response) => Observable.throw(new ResponseError(response)))
            );
    }

    public delete (instrument: IInstrument): Observable<null> {
        return this._httpClient
            .delete(`https${ this._endpoint }instruments/${ instrument.id }`)
            .pipe(
                map(() => null),
                tap(() => this._store.dispatch(deleteInstrument(instrument))),
                catchError((response) => Observable.throw(new ResponseError(response)))
            );
    }

    public select (id: string): Observable<null | IInstrument> {
        return this._store
            .pipe(
                select(createInstrumentByIdSelector(id))
            );
    }

    public update (id: string, delta: Partial<IInstrument>): Observable<null> {
        return this._httpClient
            .patch(`https${ this._endpoint }instruments/${ id }`, delta)
            .pipe(
                map(() => null),
                tap(() => this._store.dispatch(updateInstrument({ ...delta, id }))),
                catchError((response) => Observable.throw(new ResponseError(response)))
            );
    }

}
