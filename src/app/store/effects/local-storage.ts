import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { WindowService } from '../../shared/window.service';
import { mergeMidiConnections, updateMidiConnection } from '../actions';
import { ICacheableMidiConnection } from '../interfaces';
import { createMidiConnectionsSelector } from '../selectors';
import { TAppState } from '../types';

// @todo This is temporary fix to make sure Observable gets only imported as a type.
type TObservable<T> = Observable<T>;

@Injectable({
    providedIn: 'root'
})
export class LocalStorageEffects {

    private _window: null | Window;

    constructor (
        private _actions$: Actions,
        private _store: Store<TAppState>,
        windowService: WindowService
    ) {
        this._window = windowService.nativeWindow;
    }

    @Effect({ dispatch: false }) get setMidiConnections$ (): TObservable<void> {
        return this._actions$
            .pipe(
                ofType(mergeMidiConnections, updateMidiConnection),
                withLatestFrom(
                    createMidiConnectionsSelector(this._store),
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
