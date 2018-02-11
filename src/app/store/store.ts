import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from './interfaces';
import { instrumentsReducer } from './reducers/instruments';
import { midiConnectionsReducer } from './reducers/midi-connections';
import { midiOutputsReducer } from './reducers/midi-outputs';

export const appReducer: ActionReducerMap<IAppState> = {
    instruments: instrumentsReducer,
    midiConnections: midiConnectionsReducer,
    midiOutputs: midiOutputsReducer
};
