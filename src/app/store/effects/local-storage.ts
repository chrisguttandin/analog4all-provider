import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { WindowService } from '../../shared/window.service';
import { MERGE_MIDI_CONNECTIONS, UPDATE_MIDI_CONNECTION } from '../actions';
import { IAppState, ICacheableMidiConnection } from '../interfaces';
import { selectMidiConnections } from '../selectors';

@Injectable()
export class LocalStorageEffects {

    private _window: null | Window;

    constructor (
        private _actions$: Actions,
        private _store: Store<IAppState>,
        windowService: WindowService
    ) {
        this._window = windowService.nativeWindow;
    }

    @Effect({ dispatch: false }) public get setMidiConnections$ (): Observable<void> {
        return this._actions$
            .pipe(
                ofType(MERGE_MIDI_CONNECTIONS, UPDATE_MIDI_CONNECTION),
                withLatestFrom(
                    this._store
                        .pipe(
                            select(selectMidiConnections)
                        ),
                    (_, midiConnections) => midiConnections),
                map((midiConnections) => {
                    if (this._window !== null) {
                        const strippedMidiConnections: ICacheableMidiConnection[] = midiConnections
                            .map(({ instrumentId: _1, isConnected: _2, ...properties }) => properties);

                        this._window.localStorage.setItem('midiConnections', JSON.stringify(strippedMidiConnections));
                    }
                })
            );
    }

}
