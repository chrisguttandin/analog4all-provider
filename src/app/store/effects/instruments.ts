import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';
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
        // eslint-disable-next-line no-invalid-this
        this._actions$.pipe(
            pluckPayloadOfType(deleteInstrument),
            // eslint-disable-next-line no-invalid-this
            mergeMap((instrument) => this._instrumentService.delete(instrument))
        )
    );

    public patchInstrument$ = createEffect(() =>
        // eslint-disable-next-line no-invalid-this
        this._actions$.pipe(
            pluckPayloadOfType(patchInstrument),
            // eslint-disable-next-line no-invalid-this
            mergeMap((instrument) => this._instrumentService.patch(instrument))
        )
    );

    // eslint-disable-next-line no-invalid-this
    public removeInstrument$ = createEffect(() => this._actions$.pipe(pluckPayloadOfType(deleteInstrumentSuccess), map(removeInstrument)));

    // eslint-disable-next-line no-invalid-this
    public updateInstrument$ = createEffect(() => this._actions$.pipe(pluckPayloadOfType(patchInstrumentSuccess), map(updateInstrument)));

    constructor(private _actions$: Actions, private _instrumentService: InstrumentService) {}
}
