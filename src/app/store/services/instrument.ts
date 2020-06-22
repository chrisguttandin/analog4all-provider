import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ENDPOINT } from '../../shared';
import { deleteInstrumentFail, deleteInstrumentSuccess, patchInstrumentFail, patchInstrumentSuccess } from '../actions';
import {
    IDeleteInstrumentFailAction,
    IDeleteInstrumentSuccessAction,
    IPatchInstrumentFailAction,
    IPatchInstrumentSuccessAction
} from '../interfaces';
import { TIdentifiable, TInstrument } from '../types';

@Injectable({
    providedIn: 'root'
})
export class InstrumentService {
    constructor(@Inject(ENDPOINT) private _endpoint: string, private _httpClient: HttpClient) {}

    public delete(instrument: TInstrument): Observable<IDeleteInstrumentFailAction | IDeleteInstrumentSuccessAction> {
        return this._httpClient.delete(`https${this._endpoint}instruments/${instrument.id}`).pipe(
            map(() => deleteInstrumentSuccess(instrument)),
            catchError(() => of(deleteInstrumentFail(instrument)))
        );
    }

    public patch({
        id,
        ...delta
    }: TIdentifiable<TInstrument, 'id'>): Observable<IPatchInstrumentFailAction | IPatchInstrumentSuccessAction> {
        return this._httpClient.patch(`https${this._endpoint}instruments/${id}`, delta).pipe(
            map(() => patchInstrumentSuccess({ id, ...delta })),
            catchError(() => of(patchInstrumentFail(id)))
        );
    }
}
