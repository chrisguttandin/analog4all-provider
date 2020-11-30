import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
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
import { InstrumentService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class InstrumentsEffects {
    public deleteInstrument$ = createEffect(() =>
        this._actions$.pipe(
            pluckPayloadOfType(deleteInstrument),
            mergeMap((instrument) => this._instrumentService.delete(instrument))
        )
    );

    public patchInstrument$ = createEffect(() =>
        this._actions$.pipe(
            pluckPayloadOfType(patchInstrument),
            mergeMap((instrument) => this._instrumentService.patch(instrument))
        )
    );

    public removeInstrument$ = createEffect(() => this._actions$.pipe(pluckPayloadOfType(deleteInstrumentSuccess), map(removeInstrument)));

    public updateInstrument$ = createEffect(() => this._actions$.pipe(pluckPayloadOfType(patchInstrumentSuccess), map(updateInstrument)));
    constructor(private _actions$: Actions, private _instrumentService: InstrumentService) {}
}
