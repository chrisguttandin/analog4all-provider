import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, withLatestFrom } from 'rxjs';
import { MidiOutputsService } from '../../shared/midi-outputs.service';
import { mergeMidiConnections, watchMidiOutputs } from '../actions';
import { createMidiConnectionsSelector } from '../selectors';
import { TAppState } from '../types';

@Injectable({
    providedIn: 'root'
})
export class MidiOutputsEffects {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    public mergeMidiConnections$ = createEffect(() =>
        this._actions$.pipe(
            ofType(watchMidiOutputs),
            mergeMap(() => this._midiOutputsService.watch()),
            withLatestFrom(createMidiConnectionsSelector(this._store)),
            map(([midiOutputs, midiConnections]) =>
                mergeMidiConnections([
                    ...midiOutputs.map(({ id, name }) => {
                        const midiConnection = midiConnections.find(({ midiOutputId }) => id === midiOutputId);

                        return {
                            isConnected: true,
                            midiOutputId: id,
                            midiOutputName: name === undefined ? '' : name,
                            name: midiConnection === undefined ? null : midiConnection.name,
                            sourceId: midiConnection === undefined ? 'default' : midiConnection.sourceId
                        };
                    }),
                    ...midiConnections
                        .filter(({ midiOutputId }) => midiOutputs.every(({ id }) => midiOutputId !== id))
                        .map((midiConnection) => ({ ...midiConnection, isConnected: false }))
                ])
            )
        )
    );

    constructor(private _actions$: Actions, private _midiOutputsService: MidiOutputsService, private _store: Store<TAppState>) {}
}
