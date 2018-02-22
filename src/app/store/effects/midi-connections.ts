import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { REMOVE_INSTRUMENT, updateMidiConnection } from '../actions';
import { IAppState, IRemoveInstrumentAction, IUpdateMidiConnectionAction } from '../interfaces';
import { selectMidiConnections } from '../selectors';

@Injectable()
export class MidiConnectionsEffects {

    constructor (
        private _actions$: Actions,
        private _store: Store<IAppState>
    ) { }

    // @todo Ideally the flow of actions should be the other way round. Delete the reference first and the instrument afterwards.
    @Effect() public get updateMidiConnection$ (): Observable<IUpdateMidiConnectionAction> {
        return this._actions$
            .pipe(
                ofType<IRemoveInstrumentAction>(REMOVE_INSTRUMENT),
                withLatestFrom(this._store
                    .pipe(
                        select(selectMidiConnections)
                    )),
                map(([ { payload: instrument }, midiConnections ]) => midiConnections
                    .filter(({ instrumentId }) => (instrumentId === instrument.id))),
                filter((midiConnections) => (midiConnections.length > 0)),
                // @todo Create updateMidiConnections() action creator.
                mergeMap((midiConnections) => from(midiConnections
                    .map(({ midiOutputId }) => updateMidiConnection({ instrumentId: undefined, midiOutputId }))))
            );
    }

}
