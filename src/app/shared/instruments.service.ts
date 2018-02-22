import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IDataChannel, connect, isSupported } from 'rxjs-broker';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { IInstrument } from '../interfaces';
import { addInstrument } from '../store/actions';
import { IAppState } from '../store/interfaces';
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

}
