import { ActionReducerMap } from '@ngrx/store';
import { instrumentsReducer, midiConnectionsReducer } from './reducers';
import { TAppState, TStoreAction } from './types';

export const appReducer: ActionReducerMap<TAppState, TStoreAction> = {
    instruments: instrumentsReducer,
    midiConnections: midiConnectionsReducer
};
