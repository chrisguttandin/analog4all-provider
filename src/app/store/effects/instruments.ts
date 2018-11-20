import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
    DELETE_INSTRUMENT,
    DELETE_INSTRUMENT_SUCCESS,
    PATCH_INSTRUMENT,
    PATCH_INSTRUMENT_SUCCESS,
    removeInstrument,
    updateInstrument
} from '../actions';
import {
    IDeleteInstrumentAction,
    IDeleteInstrumentFailAction,
    IDeleteInstrumentSuccessAction,
    IPatchInstrumentAction,
    IPatchInstrumentFailAction,
    IPatchInstrumentSuccessAction,
    IRemoveInstrumentAction,
    IUpdateInstrumentAction
} from '../interfaces';
import { InstrumentService } from '../services';

@Injectable()
export class InstrumentsEffects {

    constructor (
        private _actions$: Actions,
        private _instrumentService: InstrumentService
    ) { }

    @Effect() public get deleteInstrument$ (): Observable<IDeleteInstrumentFailAction | IDeleteInstrumentSuccessAction> {
        return this._actions$
            .pipe(
                ofType<IDeleteInstrumentAction>(DELETE_INSTRUMENT),
                mergeMap(({ payload: instrument }) => this._instrumentService.delete(instrument))
            );
    }

    @Effect() public get patchInstrument$ (): Observable<IPatchInstrumentFailAction | IPatchInstrumentSuccessAction> {
        return this._actions$
            .pipe(
                ofType<IPatchInstrumentAction>(PATCH_INSTRUMENT),
                mergeMap(({ payload: instrument }) => this._instrumentService.patch(instrument))
            );
    }

    @Effect() public get removeInstrument$ (): Observable<IRemoveInstrumentAction> {
        return this._actions$
            .pipe(
                ofType<IDeleteInstrumentSuccessAction>(DELETE_INSTRUMENT_SUCCESS),
                map(({ payload: instrument }) => removeInstrument(instrument))
            );
    }

    @Effect() public get updateInstrument$ (): Observable<IUpdateInstrumentAction> {
        return this._actions$
            .pipe(
                ofType<IPatchInstrumentSuccessAction>(PATCH_INSTRUMENT_SUCCESS),
                map(({ payload: instrument }) => updateInstrument(instrument))
            );
    }

}
