import { createSelector, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IMidiConnection } from '../../interfaces';
import { IAppState } from '../interfaces';

const findMidiConnectionByMidiOutputIdSelector = (
    midiConnections: IAppState['midiConnections'],
    midiOutputId: IMidiConnection['midiOutputId']
) => {
    return midiConnections.find((midiConnection) => (midiConnection.midiOutputId === midiOutputId));
};

const midiConnectionByMidiOutputIdSelector = (
    midiConnections: IAppState['midiConnections'],
    { midiOutputId }: { midiOutputId: IMidiConnection['midiOutputId'] }
) => {
    const midiConnection = findMidiConnectionByMidiOutputIdSelector(midiConnections, midiOutputId);

    if (midiConnection === undefined) {
        return null;
    }

    return midiConnection;
};

const midiConnectionsSelector = (state: IAppState) => state.midiConnections;

export const createMidiConnectionByMidiOutputIdSelector = (
    store: Observable<IAppState>,
    midiOutputId: IMidiConnection['midiOutputId']
) => {
    return store
        .pipe(
            select(createSelector(midiConnectionsSelector, midiConnectionByMidiOutputIdSelector), { midiOutputId })
        );
};

export const createMidiConnectionsSelector = (store: Observable<IAppState>) => store
    .pipe(
        select(midiConnectionsSelector)
    );
