import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IMidiConnection } from '../interfaces';
import { ADD_MIDI_CONNECTION, IAppState, UPDATE_MIDI_CONNECTION } from '../store';
import { MidiOutputsService } from './midi-outputs.service';

@Injectable()
export class MidiConnectionsService {

    constructor (
        private _midiOutputsService: MidiOutputsService,
        private _store: Store<IAppState>
    ) { }

    public create (midiConnection): Observable<IMidiConnection> {
        return Observable.create((observer) => {
            this._store.dispatch({ payload: Object.assign({ sourceId: 'default' }, midiConnection ), type: ADD_MIDI_CONNECTION });

            observer.next(midiConnection);
            observer.complete();
        });
    }

    public select (midiOutputId: string): Observable<IMidiConnection> {
        return this._store
            .select('midiConnections')
            .map((midiConnections: IMidiConnection[]) => midiConnections.find(({ midiOutputId: mdTptD }) => midiOutputId === mdTptD))
            .map((midiConnections) => (midiConnections === undefined) ? null : midiConnections);
    }

    public update (midiOutputId: string, delta): Observable<null> {
        return Observable.create((observer) => {
            this._store.dispatch({ payload: Object.assign({}, delta, { midiOutputId }), type: UPDATE_MIDI_CONNECTION });

            observer.next(null);
            observer.complete();
        });
    }

}
