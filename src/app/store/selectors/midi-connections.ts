import { createSelector, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TAppState, TMidiConnection } from '../types';

const findMidiConnectionByMidiOutputIdSelector = (
    midiConnections: TAppState['midiConnections'],
    midiOutputId: TMidiConnection['midiOutputId']
) => {
    return midiConnections.find((midiConnection) => midiConnection.midiOutputId === midiOutputId);
};

const midiConnectionByMidiOutputIdSelector = (
    midiConnections: TAppState['midiConnections'],
    midiOutputId: TMidiConnection['midiOutputId']
) => {
    const midiConnection = findMidiConnectionByMidiOutputIdSelector(midiConnections, midiOutputId);

    if (midiConnection === undefined) {
        return null;
    }

    return midiConnection;
};

const midiConnectionsSelector = (state: TAppState) => state.midiConnections;

export const createMidiConnectionByMidiOutputIdSelector = (store: Observable<TAppState>, midiOutputId: TMidiConnection['midiOutputId']) => {
    return store.pipe(select(createSelector(midiConnectionsSelector, midiConnectionByMidiOutputIdSelector), midiOutputId));
};

export const createMidiConnectionsSelector = (store: Observable<TAppState>) => store.pipe(select(midiConnectionsSelector));
