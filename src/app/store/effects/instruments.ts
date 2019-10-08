import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
    deleteInstrument,
    deleteInstrumentSuccess,
    patchInstrument,
    patchInstrumentSuccess,
    removeInstrument,
    updateInstrument
} from '../actions';
import {
    IDeleteInstrumentFailAction,
    IDeleteInstrumentSuccessAction,
    IPatchInstrumentFailAction,
    IPatchInstrumentSuccessAction,
    IRemoveInstrumentAction,
    IUpdateInstrumentAction
} from '../interfaces';
import { InstrumentService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class InstrumentsEffects {

    constructor (
        private _actions$: Actions,
        private _instrumentService: InstrumentService
    ) { }

    @Effect() get deleteInstrument$ (): Observable<IDeleteInstrumentFailAction | IDeleteInstrumentSuccessAction> {
        return this._actions$
            .pipe(
                ofType(deleteInstrument),
                mergeMap(({ payload: instrument }) => this._instrumentService.delete(instrument))
            );
    }

    @Effect() get patchInstrument$ (): Observable<IPatchInstrumentFailAction | IPatchInstrumentSuccessAction> {
        return this._actions$
            .pipe(
                ofType(patchInstrument),
                mergeMap(({ payload: instrument }) => this._instrumentService.patch(instrument))
            );
    }

    @Effect() get removeInstrument$ (): Observable<IRemoveInstrumentAction> {
        return this._actions$
            .pipe(
                ofType(deleteInstrumentSuccess),
                map(({ payload: instrument }) => removeInstrument(instrument))
            );
    }

    @Effect() get updateInstrument$ (): Observable<IUpdateInstrumentAction> {
        return this._actions$
            .pipe(
                ofType(patchInstrumentSuccess),
                map(({ payload: instrument }) => updateInstrument(instrument))
            );
    }

}
