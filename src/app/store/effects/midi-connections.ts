import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { debounceTime, filter, first, map, mergeMap, pairwise, withLatestFrom } from 'rxjs/operators';
import { IInstrument, IMidiConnection } from '../../interfaces';
import { UPDATE_MIDI_CONNECTION, deleteInstrument, patchInstrument } from '../actions';
import { IAppState, IDeleteInstrumentAction, IPatchInstrumentAction, IUpdateMidiConnectionAction } from '../interfaces';
import { createInstrumentByIdSelector, createMidiConnectionByMidiOutputIdSelector, createMidiConnectionsSelector } from '../selectors';

@Injectable()
export class MidiConnectionsEffects {

    constructor (
        private _actions$: Actions,
        private _store: Store<IAppState>
    ) { }

    @Effect() get deleteInstruments$ (): Observable<IDeleteInstrumentAction> {
        return this._actions$
            .pipe(
                ofType<IUpdateMidiConnectionAction>(UPDATE_MIDI_CONNECTION),
                withLatestFrom(createMidiConnectionsSelector(this._store)
                    .pipe(
                        pairwise()
                    )),
                map(([ , [ previousMidiConnections, currentMidiConnections ] ]) => previousMidiConnections
                    .filter<{ instrumentId: string } & IMidiConnection>(
                        (midiConnection): midiConnection is { instrumentId: string } & IMidiConnection => {
                            return (midiConnection.instrumentId !== undefined);
                        })
                    .filter(({ midiOutputId }) => currentMidiConnections
                        .some(({ instrumentId, midiOutputId: mdTptD }) => (midiOutputId === mdTptD && instrumentId === undefined)))
                    .map(({ instrumentId }) => instrumentId)),
                filter((instrumentIds) => (instrumentIds.length > 0)),
                mergeMap((instrumentIds) => from(instrumentIds)),
                mergeMap((instrumentId) => createInstrumentByIdSelector(this._store, instrumentId)
                    .pipe(
                        filter((instrument): instrument is IInstrument => instrument !== null),
                        first()
                    )),
                map((instrument) => deleteInstrument(instrument))
            );
    }

    @Effect() get patchInstrument$ (): Observable<IPatchInstrumentAction> {
        return this._actions$
            .pipe(
                ofType<IUpdateMidiConnectionAction>(UPDATE_MIDI_CONNECTION),
                debounceTime(500),
                map(({ payload: midiConnection }) => midiConnection),
                filter((midiConnection) => !('instrumentId' in midiConnection)),
                mergeMap(
                    (midiConnection) => createMidiConnectionByMidiOutputIdSelector(this._store, midiConnection.midiOutputId)
                        .pipe(
                            filter((mdCnnctn): mdCnnctn is IMidiConnection => (mdCnnctn !== null)),
                            first(),
                            map(({ instrumentId, midiOutputName }) => [ instrumentId, midiOutputName ]),
                            filter<(string | undefined)[], [ string, string ]>((args): args is [ string, string ] => args[0] !== undefined),
                            map(([ instrumentId, midiOutputName ]) => ({ instrumentId, midiConnection, midiOutputName })))
                        ),
                filter(({ midiConnection: { description, gearogsSlug, name, soundCloudUsername } }) => {
                    return (description !== undefined ||
                        gearogsSlug !== undefined ||
                        name !== undefined ||
                        soundCloudUsername !== undefined);
                }),
                map(({ instrumentId, midiConnection, midiOutputName }) => {
                    const { description, gearogsSlug, name, soundCloudUsername } = midiConnection;
                    const instrument = { description, gearogsSlug, soundCloudUsername };

                    if (name !== undefined) {
                        return patchInstrument({ id: instrumentId, ...instrument, name: (name === null) ? midiOutputName : name });
                    }

                    return patchInstrument({ id: instrumentId, ...instrument });
                })
            );
    }

}
