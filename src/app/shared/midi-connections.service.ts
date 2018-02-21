import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IMidiConnection } from '../interfaces';
import { addMidiConnection, updateMidiConnection } from '../store/actions';
import { IAppState } from '../store/interfaces';

@Injectable()
export class MidiConnectionsService {

    constructor (
        private _store: Store<IAppState>
    ) { }

    public create (midiConnection: { midiOutputId: string }): Observable<IMidiConnection> {
        return new Observable((observer) => {
            const mergedMidiConnection = { sourceId: 'default', ...midiConnection };

            this._store.dispatch(addMidiConnection(mergedMidiConnection));

            observer.next(mergedMidiConnection);
            observer.complete();
        });
    }

    public update (midiOutputId: string, delta: Partial<IMidiConnection>): Observable<null> {
        return new Observable<null>((observer) => {
            this._store.dispatch(updateMidiConnection({ ...delta, midiOutputId }));

            observer.next(null);
            observer.complete();
        });
    }

}
