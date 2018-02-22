import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';
import { MidiAccessService } from './midi-access.service';
import { PermissionStateService } from './permission-state';

@Injectable()
export class MidiOutputsService {

    private _midiAccess: null | WebMidi.MIDIAccess;

    constructor (
        private _midiAccessService: MidiAccessService,
        private _permissionStateService: PermissionStateService
    ) {
        this._midiAccess = null;
    }

    public get (id: string): WebMidi.MIDIOutput {
        if (this._midiAccess === null) {
            throw new Error('Expected an exisiting MIDIAccess object.');
        }

        const midiOutput = Array
            .from(this._midiAccess.outputs.values())
            .find(({ id: d }) => (id === d));

        if (midiOutput === undefined) {
            throw new Error('A MIDIOutput with the given id is not connected.');
        }

        return midiOutput;
    }

    public watch (): Observable<WebMidi.MIDIOutput[]> {
        const midiOutputs$ = new Observable<WebMidi.MIDIOutput[]>((observer) => {
            if (this._midiAccessService.isSupported && this._permissionStateService.isSupported) {
                let onStateChangeListener: null | EventListener = null;

                this._midiAccessService
                    .request()
                    .then((midiAccess) => {
                        this._midiAccess = midiAccess;

                        observer.next(Array.from(midiAccess.outputs.values()));

                        onStateChangeListener = () => {
                            if (midiAccess !== null) {
                                observer.next(Array.from(midiAccess.outputs.values()));
                            }
                        };

                        midiAccess.addEventListener('statechange', onStateChangeListener);
                    });

                return () => {
                    if (this._midiAccess !== null && onStateChangeListener !== null) {
                        this._midiAccess.removeEventListener('statechange', onStateChangeListener);
                        this._midiAccess = null;
                    }
                };
            }

            observer.complete();

            // @todo The return statement is necessary to keep TypeScript happy.
            return;
        });

        return this._permissionStateService
            .watch('midi')
            .pipe(
                switchMap((permissionState) => {
                    if (permissionState === 'granted') {
                        return midiOutputs$;
                    }

                    return of([ ]);
                })
            );
    }

}
