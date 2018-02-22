import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';
import { IInstrument } from '../../interfaces';
import { ENDPOINT } from '../../shared';
import { patchInstrumentFail, patchInstrumentSuccess } from '../actions';
import { IPatchInstrumentFailAction, IPatchInstrumentSuccessAction } from '../interfaces';

@Injectable()
export class InstrumentService {

    constructor (
        @Inject(ENDPOINT) private _endpoint: string,
        private _httpClient: HttpClient
    ) { }

    public patch (
        { id, ...delta }: { id: IInstrument['id'] } & Partial<IInstrument>
    ): Observable<IPatchInstrumentFailAction | IPatchInstrumentSuccessAction> {
        return this._httpClient
            .patch<void>(`https${ this._endpoint }instruments/${ id }`, delta)
            .pipe(
                map(() => patchInstrumentSuccess({ id, ...delta })),
                catchError(() => of(patchInstrumentFail(id)))
            );
    }

}
