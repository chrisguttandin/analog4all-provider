import { createReducer, on } from '@ngrx/store';
import { mergeMidiConnections, updateMidiConnection } from '../actions';
import { TIdentifiable, TMidiConnection, TStoreAction } from '../types';

const mergeMidiConnectionsFunction = (oldMidiConnections: readonly TMidiConnection[], newMidiConnections: readonly TMidiConnection[]) => {
    const intersectingMidiConnections = oldMidiConnections
        .map((midiConnection) => [ midiConnection, newMidiConnections
            .find(({ midiOutputId }) => midiConnection.midiOutputId === midiOutputId) ])
        .filter((oldAndNewMidiConnection): oldAndNewMidiConnection is [ TMidiConnection, TMidiConnection ] => {
            return (oldAndNewMidiConnection[1] !== undefined);
        })
        .map(([ oldMidiConnection, newMidiConnection ]) => ({ ...oldMidiConnection, ...newMidiConnection }));

    const remainingMidiConnections = oldMidiConnections
        .filter(({ midiOutputId }) => intersectingMidiConnections.every(({ midiOutputId: mdTptD }) => midiOutputId !== mdTptD));

    const additionalMidiConnections = newMidiConnections
        .filter(({ midiOutputId }) => intersectingMidiConnections.every(({ midiOutputId: mdTptD }) => midiOutputId !== mdTptD));

    return [ ...remainingMidiConnections, ...intersectingMidiConnections, ...additionalMidiConnections ];
};

const updateMidiConnectionFunction = (
    midiConnections: readonly TMidiConnection[],
    midiConnection: TIdentifiable<TMidiConnection, 'midiOutputId'>
) => {
    const index = midiConnections.findIndex(({ midiOutputId }) => midiOutputId === midiConnection.midiOutputId);

    if (index === -1) {
        throw new Error('An midiConnection with the same id is not stored.');
    }

    return [
        ...midiConnections.slice(0, index),
        { ...midiConnections[index], ...midiConnection },
        ...midiConnections.slice(index + 1)
    ];
};

const reducer = createReducer<readonly TMidiConnection[]>(
    [ ],
    on(mergeMidiConnections, (state, { payload }) => mergeMidiConnectionsFunction(state, payload)),
    on(updateMidiConnection, (state, { payload }) => updateMidiConnectionFunction(state, payload))
);

// @todo Defining this as a function was necessary to enable AoT with TypeScript 2.0.X.
export function midiConnectionsReducer (state: readonly TMidiConnection[] = [], action: TStoreAction): readonly TMidiConnection[] {
    return reducer(state, action);
}
