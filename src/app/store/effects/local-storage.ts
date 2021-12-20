import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import { WindowService } from '../../shared/window.service';
import { mergeMidiConnections, updateMidiConnection } from '../actions';
import { ICacheableMidiConnection } from '../interfaces';
import { createMidiConnectionsSelector } from '../selectors';
import { TAppState } from '../types';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageEffects {
    public setMidiConnections$ = createEffect(
        () =>
            // eslint-disable-next-line no-invalid-this
            this._actions$.pipe(
                ofType(mergeMidiConnections, updateMidiConnection),
                // eslint-disable-next-line no-invalid-this
                withLatestFrom(createMidiConnectionsSelector(this._store), (_, midiConnections) => midiConnections),
                map((midiConnections) => {
                    // eslint-disable-next-line no-invalid-this
                    if (this._window !== null) {
                        const strippedMidiConnections: ICacheableMidiConnection[] = midiConnections.map(
                            // eslint-disable-next-line no-unused-vars
                            ({ instrumentId, isConnected, ...properties }) => properties
                        );

                        // eslint-disable-next-line no-invalid-this
                        this._window.localStorage.setItem('midiConnections', JSON.stringify(strippedMidiConnections));
                    }
                })
            ),
        { dispatch: false }
    );

    private _window: null | Window;

    constructor(private _actions$: Actions, private _store: Store<TAppState>, windowService: WindowService) {
        this._window = windowService.nativeWindow;
    }
}
