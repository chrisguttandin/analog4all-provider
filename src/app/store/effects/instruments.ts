import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { pluckPayloadOfType } from '../../operators';
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
    constructor(private _actions$: Actions, private _instrumentService: InstrumentService) {}

    @Effect() get deleteInstrument$(): Observable<IDeleteInstrumentFailAction | IDeleteInstrumentSuccessAction> {
        return this._actions$.pipe(
            pluckPayloadOfType(deleteInstrument),
            mergeMap((instrument) => this._instrumentService.delete(instrument))
        );
    }

    @Effect() get patchInstrument$(): Observable<IPatchInstrumentFailAction | IPatchInstrumentSuccessAction> {
        return this._actions$.pipe(
            pluckPayloadOfType(patchInstrument),
            mergeMap((instrument) => this._instrumentService.patch(instrument))
        );
    }

    @Effect() get removeInstrument$(): Observable<IRemoveInstrumentAction> {
        return this._actions$.pipe(
            pluckPayloadOfType(deleteInstrumentSuccess),
            map((instrument) => removeInstrument(instrument))
        );
    }

    @Effect() get updateInstrument$(): Observable<IUpdateInstrumentAction> {
        return this._actions$.pipe(
            pluckPayloadOfType(patchInstrumentSuccess),
            map((instrument) => updateInstrument(instrument))
        );
    }
}
