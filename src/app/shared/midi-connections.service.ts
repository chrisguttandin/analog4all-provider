import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { IMidiConnection } from '../interfaces';
import { ADD_MIDI_CONNECTION, IAppState, UPDATE_MIDI_CONNECTION } from '../store';

@Injectable()
export class MidiConnectionsService {

    constructor (
        private _store: Store<IAppState>
    ) { }

    public create (midiConnection: { midiOutputId: string }): Observable<IMidiConnection> {
        return new Observable((observer) => {
            const mergedMidiConnection = Object.assign({ sourceId: 'default' }, midiConnection);

            this._store.dispatch({ payload: mergedMidiConnection, type: ADD_MIDI_CONNECTION });

            observer.next(mergedMidiConnection);
            observer.complete();
        });
    }

    public select (midiOutputId: string): Observable<IMidiConnection> {
        return this._store
            .select('midiConnections')
            .pipe(
                map<IMidiConnection[], undefined | IMidiConnection>
                    ((midiConnections) => midiConnections.find(({ midiOutputId: mdTptD }) => midiOutputId === mdTptD)),
                map<undefined | IMidiConnection, null | IMidiConnection>
                    ((midiConnections) => (midiConnections === undefined) ? null : midiConnections)
            );
    }

    public update (midiOutputId: string, delta: object): Observable<null> {
        return new Observable<null>((observer) => {
            this._store.dispatch({ payload: Object.assign({}, delta, { midiOutputId }), type: UPDATE_MIDI_CONNECTION });

            observer.next(null);
            observer.complete();
        });
    }

}
