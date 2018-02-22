import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap } from 'rxjs/operators';
import { PATCH_INSTRUMENT, PATCH_INSTRUMENT_SUCCESS, updateInstrument } from '../actions';
import { IPatchInstrumentAction, IPatchInstrumentFailAction, IPatchInstrumentSuccessAction, IUpdateInstrumentAction } from '../interfaces';
import { InstrumentService } from '../services';

@Injectable()
export class InstrumentsEffects {

    constructor (
        private _actions$: Actions,
        private _instrumentService: InstrumentService
    ) { }

    @Effect() public get patchInstrument$ (): Observable<IPatchInstrumentFailAction | IPatchInstrumentSuccessAction> {
        return this._actions$
            .pipe(
                ofType<IPatchInstrumentAction>(PATCH_INSTRUMENT),
                mergeMap(({ payload: instrument }) => this._instrumentService.patch(instrument))
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
