import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from './interfaces';
import { instrumentsReducer, midiConnectionsReducer, midiOutputsReducer } from './reducers';

export const appReducer: ActionReducerMap<IAppState> = {
    instruments: instrumentsReducer,
    midiConnections: midiConnectionsReducer,
    midiOutputs: midiOutputsReducer
};
