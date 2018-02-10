import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { tap } from 'rxjs/operators';
import { IAppState } from '../store';
import { updateMidiOutputs } from '../store/actions';
import { MidiAccessService } from './midi-access.service';

@Injectable()
export class MidiOutputsService {

    constructor (
        private _midiAccessService: MidiAccessService,
        private _store: Store<IAppState>
    ) { }

    public watch (): Observable<WebMidi.MIDIOutput[]> {
        return new Observable((observer: Observer<WebMidi.MIDIOutput[]>) => {
            let midiAccess: null | WebMidi.MIDIAccess = null;

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
            .pipe(
                tap((midiOutputs: WebMidi.MIDIOutput[]) => this._store.dispatch(updateMidiOutputs(midiOutputs)))
            );
    }

}
