import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { IAppState, UPDATE_MIDI_OUTPUTS } from '../store';
import { MidiAccessService } from './midi-access.service';

@Injectable()
export class MidiOutputsService {

    constructor (
        private _midiAccessService: MidiAccessService,
        private _store: Store<IAppState>
    ) { }

    public watch (): Observable<WebMidi.MIDIOutput[]> {
        return Observable
            .create((observer: Observer<WebMidi.MIDIOutput[]>) => {
                let midiAccess: null | WebMidi.MIDIAccess = null;

                let onStateChangeListener: null | EventListener = null;

                this._midiAccessService
                    .request()
                    .then((mdAccss) => {
                        midiAccess = mdAccss;

                        observer.next(Array.from(midiAccess.outputs.values()));

                        onStateChangeListener = () => {
                            if (midiAccess !== null) {
                                observer.next(Array.from(midiAccess.outputs.values()));
                            }
                        };

                        midiAccess.addEventListener('statechange', onStateChangeListener);
                    });

                return () => {
                    if (midiAccess !== null && onStateChangeListener !== null) {
                        midiAccess.removeEventListener('statechange', onStateChangeListener);
                    }
                };
            })
            .do((midiOutputs: WebMidi.MIDIOutput[]) => this._store.dispatch({ payload: midiOutputs, type: UPDATE_MIDI_OUTPUTS }));
    }

}
