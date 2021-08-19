import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { debounceTime, filter, first, map, mergeMap, pairwise, withLatestFrom } from 'rxjs/operators';
import { pluckPayloadOfType } from '../../operators';
import { deleteInstrument, patchInstrument, updateMidiConnection } from '../actions';
import { createInstrumentByIdSelector, createMidiConnectionByMidiOutputIdSelector, createMidiConnectionsSelector } from '../selectors';
import { TAppState, TInstrument, TMidiConnection } from '../types';

@Injectable({
    providedIn: 'root'
})
export class MidiConnectionsEffects {
    public deleteInstruments$ = createEffect(() =>
        // eslint-disable-next-line no-invalid-this
        this._actions$.pipe(
            ofType(updateMidiConnection),
            // eslint-disable-next-line no-invalid-this
            withLatestFrom(createMidiConnectionsSelector(this._store).pipe(pairwise())),
            map(([, [previousMidiConnections, currentMidiConnections]]) =>
                previousMidiConnections
                    .filter(
                        (midiConnection): midiConnection is { instrumentId: string } & TMidiConnection =>
                            midiConnection.instrumentId !== undefined
                    )
                    .filter(({ midiOutputId }) =>
                        currentMidiConnections.some(
                            ({ instrumentId, midiOutputId: mdTptD }) => midiOutputId === mdTptD && instrumentId === undefined
                        )
                    )
                    .map(({ instrumentId }) => instrumentId)
            ),
            filter((instrumentIds) => instrumentIds.length > 0),
            mergeMap((instrumentIds) => from(instrumentIds)),
            mergeMap((instrumentId) =>
                // eslint-disable-next-line no-invalid-this
                createInstrumentByIdSelector(this._store, instrumentId).pipe(
                    filter((instrument): instrument is TInstrument => instrument !== null),
                    first()
                )
            ),
            map(deleteInstrument)
        )
    );

    public patchInstrument$ = createEffect(() =>
        // eslint-disable-next-line no-invalid-this
        this._actions$.pipe(
            pluckPayloadOfType(updateMidiConnection),
            debounceTime(500),
            filter((midiConnection) => !('instrumentId' in midiConnection)),
            mergeMap((midiConnection) =>
                // eslint-disable-next-line no-invalid-this
                createMidiConnectionByMidiOutputIdSelector(this._store, midiConnection.midiOutputId).pipe(
                    filter((mdCnnctn): mdCnnctn is TMidiConnection => mdCnnctn !== null),
                    first(),
                    map(({ instrumentId, midiOutputName }) => [instrumentId, midiOutputName]),
                    filter<(string | undefined)[], [string, string]>((args): args is [string, string] => args[0] !== undefined),
                    map(([instrumentId, midiOutputName]) => ({ instrumentId, midiConnection, midiOutputName }))
                )
            ),
            filter(
                ({ midiConnection: { description, gearogsSlug, name, soundCloudUsername } }) =>
                    description !== undefined || gearogsSlug !== undefined || name !== undefined || soundCloudUsername !== undefined
            ),
            map(({ instrumentId, midiConnection, midiOutputName }) => {
                const { description, gearogsSlug, name, soundCloudUsername } = midiConnection;
                const instrument = { description, gearogsSlug, soundCloudUsername };

                if (name !== undefined) {
                    return patchInstrument({ id: instrumentId, ...instrument, name: name === null ? midiOutputName : name });
                }

                return patchInstrument({ id: instrumentId, ...instrument });
            })
        )
    );

    constructor(private _actions$: Actions, private _store: Store<TAppState>) {}
}
