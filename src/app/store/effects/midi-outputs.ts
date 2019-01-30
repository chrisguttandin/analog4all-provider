import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { MidiOutputsService } from '../../shared';
import { WATCH_MIDI_OUTPUTS, mergeMidiConnections } from '../actions';
import { IAppState, IMergeMidiConnectionsAction } from '../interfaces';
import { createMidiConnectionsSelector } from '../selectors';

@Injectable()
export class MidiOutputsEffects {

    constructor (
        private _actions$: Actions,
        private _midiOutputsService: MidiOutputsService,
        private _store: Store<IAppState>
    ) { }

    @Effect() get mergeMidiConnections$ (): Observable<IMergeMidiConnectionsAction> {
        return this._actions$
            .pipe(
                ofType(WATCH_MIDI_OUTPUTS),
                mergeMap(() => this._midiOutputsService.watch()),
                withLatestFrom(createMidiConnectionsSelector(this._store)),
                map(([ midiOutputs, midiConnections ]) => mergeMidiConnections([
                    ...midiOutputs
                        .map(({ id, name }) => {
                            const midiConnection = midiConnections.find(({ midiOutputId }) => id === midiOutputId);

                            return {
                                isConnected: true,
                                midiOutputId: id,
                                midiOutputName: (name === undefined) ? '' : name,
                                name: (midiConnection === undefined) ? null : midiConnection.name,
                                sourceId: (midiConnection === undefined) ? 'default' : midiConnection.sourceId
                            };
                        }),
                    ...midiConnections
                        .filter(({ midiOutputId }) => midiOutputs
                            .every(({ id }) => midiOutputId !== id))
                        .map((midiConnection) => ({ ...midiConnection, isConnected: false }))
                ]))
            );
    }

}
