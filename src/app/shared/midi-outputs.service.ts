import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, switchMap } from 'rxjs';
import { MidiAccessService } from './midi-access.service';
import { PermissionStateService } from './permission-state';

@Injectable({
    providedIn: 'root'
})
export class MidiOutputsService {
    private _midiAccess: null | WebMidi.MIDIAccess; // eslint-disable-line no-undef

    constructor(private _midiAccessService: MidiAccessService, private _permissionStateService: PermissionStateService) {
        this._midiAccess = null;
    }

    // eslint-disable-next-line no-undef
    public get(id: string): WebMidi.MIDIOutput {
        if (this._midiAccess === null) {
            throw new Error('Expected an exisiting MIDIAccess object.');
        }

        const midiOutput = Array.from(this._midiAccess.outputs.values()).find(({ id: d }) => id === d);

        if (midiOutput === undefined) {
            throw new Error('A MIDIOutput with the given id is not connected.');
        }

        return midiOutput;
    }

    // eslint-disable-next-line no-undef
    public watch(): Observable<WebMidi.MIDIOutput[]> {
        const midiOutputs$ =
            this._midiAccessService.isSupported && this._permissionStateService.isSupported
                ? // eslint-disable-next-line no-undef
                  new Observable<WebMidi.MIDIOutput[]>((observer) => {
                      let onStateChangeListener: null | EventListener = null;

                      this._midiAccessService.request().then((midiAccess) => {
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
                  })
                : EMPTY;

        return this._permissionStateService.watch('midi').pipe(
            switchMap((permissionState) => {
                if (permissionState === 'granted') {
                    return midiOutputs$;
                }

                return of([]);
            })
        );
    }
}
