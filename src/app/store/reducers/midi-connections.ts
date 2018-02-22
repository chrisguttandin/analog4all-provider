import { IMidiConnection } from '../../interfaces';
import { ADD_MIDI_CONNECTION, MERGE_MIDI_CONNECTIONS, UPDATE_MIDI_CONNECTION } from '../actions';
import { TStoreAction } from '../types';

const addMidiConnection = (midiConnections: IMidiConnection[], midiConnection: IMidiConnection) => {
    const index = midiConnections.findIndex(({ midiOutputId }) => midiOutputId === midiConnection.midiOutputId);

    if (index > -1) {
        throw new Error('A midiConnection with the same midiOutputId does already exist.');
    }

    return [ ...midiConnections, midiConnection ];
};

const mergeMidiConnections = (oldMidiConnections: IMidiConnection[], newMidiConnections: IMidiConnection[]) => {
    const intersectingMidiConnections = oldMidiConnections
        .map((midiConnection) => [ midiConnection, newMidiConnections
            .find(({ midiOutputId }) => midiConnection.midiOutputId === midiOutputId) ])
        .filter<[ IMidiConnection, IMidiConnection ]>(
            (oldAndNewMidiConnection): oldAndNewMidiConnection is [ IMidiConnection, IMidiConnection ] => {
                return (oldAndNewMidiConnection[1] !== undefined);
            })
        .map(([ oldMidiConnection, newMidiConnection ]) => ({ ...oldMidiConnection, ...newMidiConnection }));

    const remainingMidiConnections = oldMidiConnections
        .filter(({ midiOutputId }) => intersectingMidiConnections.every(({ midiOutputId: mdTptD }) => midiOutputId !== mdTptD));

    const additionalMidiConnections = newMidiConnections
        .filter(({ midiOutputId }) => intersectingMidiConnections.every(({ midiOutputId: mdTptD }) => midiOutputId !== mdTptD));

    return [ ...remainingMidiConnections, ...intersectingMidiConnections, ...additionalMidiConnections ];
};

const updateMidiConnection = (
    midiConnections: IMidiConnection[],
    midiConnection: { midiOutputId: IMidiConnection['midiOutputId'] } & Partial<IMidiConnection>
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

// @todo Defining this as a function was necessary to enable AoT with TypeScript 2.0.X.
export function midiConnectionsReducer (state: IMidiConnection[] = [], action: TStoreAction): IMidiConnection[] {
    switch (action.type) {
        case ADD_MIDI_CONNECTION:
            return addMidiConnection(state, action.payload);
        case MERGE_MIDI_CONNECTIONS:
            return mergeMidiConnections(state, action.payload);
        case UPDATE_MIDI_CONNECTION:
            return updateMidiConnection(state, action.payload);
        default:
            return state;
    }
}
