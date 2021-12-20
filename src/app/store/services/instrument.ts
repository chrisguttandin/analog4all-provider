import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ActionType } from '@ngrx/store';
import { Observable, catchError, mapTo, of } from 'rxjs';
import { ENDPOINT } from '../../shared';
import { deleteInstrumentFail, deleteInstrumentSuccess, patchInstrumentFail, patchInstrumentSuccess } from '../actions';
import { TIdentifiable, TInstrument } from '../types';

@Injectable({
    providedIn: 'root'
})
export class InstrumentService {
    constructor(@Inject(ENDPOINT) private _endpoint: string, private _httpClient: HttpClient) {}

    public delete(instrument: TInstrument): Observable<ActionType<typeof deleteInstrumentFail | typeof deleteInstrumentSuccess>> {
        return this._httpClient.delete(`https${this._endpoint}instruments/${instrument.id}`).pipe(
            mapTo(deleteInstrumentSuccess(instrument)),
            catchError(() => of(deleteInstrumentFail(instrument)))
        );
    }

    public patch({
        id,
        ...delta
    }: TIdentifiable<TInstrument, 'id'>): Observable<ActionType<typeof patchInstrumentFail | typeof patchInstrumentSuccess>> {
        return this._httpClient.patch(`https${this._endpoint}instruments/${id}`, delta).pipe(
            mapTo(patchInstrumentSuccess({ id, ...delta })),
            catchError(() => of(patchInstrumentFail(id)))
        );
    }
}
