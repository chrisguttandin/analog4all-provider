import { IMidiConnection } from '../../interfaces';
import { ADD_MIDI_CONNECTION, UPDATE_MIDI_CONNECTION } from '../actions';
import { TMidiConnectionAction } from '../types';

const addMidiConnection = (midiConnections: IMidiConnection[], midiConnection: IMidiConnection) => {
    const index = midiConnections.findIndex(({ midiOutputId }) => midiOutputId === midiConnection.midiOutputId);

    if (index > -1) {
        throw new Error('A midiConnection with the same midiOutputId does already exist.');
    }

    return [ ...midiConnections, midiConnection ];
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
export function midiConnectionsReducer (state: IMidiConnection[] = [], action: TMidiConnectionAction): IMidiConnection[] {
    switch (action.type) {
        case ADD_MIDI_CONNECTION:
            return addMidiConnection(state, action.payload);
        case UPDATE_MIDI_CONNECTION:
            return updateMidiConnection(state, action.payload);
        default:
            return state;
    }
}
