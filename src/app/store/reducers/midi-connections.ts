import { Action, ActionReducer } from '@ngrx/store';
import { IMidiConnection } from '../../interfaces';

export const ADD_MIDI_CONNECTION = 'ADD_MIDI_CONNECTION';
export const UPDATE_MIDI_CONNECTION = 'UPDATE_MIDI_CONNECTION';

const updateMidiConnection = (midiConnections, midiConnection) => {
    const index = midiConnections.findIndex(({ midiOutputId }) => midiOutputId === midiConnection.midiOutputId);

    if (index === -1) {
        return midiConnections;
    }

    return [
        ...midiConnections.slice(0, index),
        Object.assign({}, midiConnections[index], midiConnection),
        ...midiConnections.slice(index + 1)
    ];
};

// @todo Defining this as a function was necessary to enable AoT with TypeScript 2.0.X.
export function midiConnectionsReducer (state = [], action: Action): IMidiConnection[] {
    switch (action.type) {
        case ADD_MIDI_CONNECTION:
            return [ ...state, action.payload ];
        case UPDATE_MIDI_CONNECTION:
            return updateMidiConnection(state, action.payload);
        default:
            return state;
    }
}
