import { createSelector } from '@ngrx/store';
import { IAppState } from '../interfaces';

export const selectMidiConnections = (state: IAppState) => state.midiConnections;

export const createMidiConnectionByMidiOutputIdSelector = (midiOutputId: string) => createSelector(
    selectMidiConnections,
    (midiConnections) => {
        const midiConnection = midiConnections.find(({ midiOutputId: mdTptD }) => midiOutputId === mdTptD);

        if (midiConnection === undefined) {
            return null;
        }

        return midiConnection;
    }
);
