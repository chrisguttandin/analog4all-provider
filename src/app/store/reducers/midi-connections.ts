import { Action, ActionReducer } from '@ngrx/store';
import { IMidiConnection } from '../../interfaces';
import { IAddMidiConnectionAction, IUpdateMidiConnectionAction } from '../interfaces';
import { TMidiConnectionAction } from '../types';

export const ADD_MIDI_CONNECTION: IAddMidiConnectionAction['type'] = 'ADD_MIDI_CONNECTION';
export const UPDATE_MIDI_CONNECTION: IUpdateMidiConnectionAction['type'] = 'UPDATE_MIDI_CONNECTION';

const updateMidiConnection = (midiConnections: IMidiConnection[], midiConnection: IMidiConnection) => {
    const index = midiConnections.findIndex(({ midiOutputId }) => midiOutputId === midiConnection.midiOutputId);

    if (index === -1) {
        return midiConnections;
    }

    return [
        ...midiConnections.slice(0, index),
        { ...midiConnections[index], midiConnection },
        ...midiConnections.slice(index + 1)
    ];
};

// @todo Defining this as a function was necessary to enable AoT with TypeScript 2.0.X.
export function midiConnectionsReducer (state: IMidiConnection[] = [], action: TMidiConnectionAction): IMidiConnection[] {
    switch (action.type) {
        case ADD_MIDI_CONNECTION:
            return [ ...state, action.payload ];
        case UPDATE_MIDI_CONNECTION:
            return updateMidiConnection(state, action.payload);
        default:
            return state;
    }
}
