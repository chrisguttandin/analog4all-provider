import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from './interfaces';
import { instrumentsReducer, midiConnectionsReducer } from './reducers';
import { TStoreAction } from './types';

export const appReducer: ActionReducerMap<IAppState, TStoreAction> = {
    instruments: instrumentsReducer,
    midiConnections: midiConnectionsReducer
};
