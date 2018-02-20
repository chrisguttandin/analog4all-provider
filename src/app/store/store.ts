import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from './interfaces';
import { instrumentsReducer, midiConnectionsReducer, midiOutputsReducer } from './reducers';
import { TStoreAction } from './types';

export const appReducer: ActionReducerMap<IAppState, TStoreAction> = {
    instruments: instrumentsReducer,
    midiConnections: midiConnectionsReducer,
    midiOutputs: midiOutputsReducer
};
