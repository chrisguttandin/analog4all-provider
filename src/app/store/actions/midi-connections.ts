import { IMidiConnection } from '../../interfaces';
import { IAddMidiConnectionAction, IUpdateMidiConnectionAction } from '../interfaces';

export const ADD_MIDI_CONNECTION: IAddMidiConnectionAction['type'] = 'ADD_MIDI_CONNECTION';
export const UPDATE_MIDI_CONNECTION: IUpdateMidiConnectionAction['type'] = 'UPDATE_MIDI_CONNECTION';

export const addMidiConnection = (midiConnection: IMidiConnection): IAddMidiConnectionAction => ({
    payload: midiConnection,
    type: ADD_MIDI_CONNECTION
});

export const updateMidiConnection = (midiConnection: Partial<IMidiConnection>): IUpdateMidiConnectionAction => ({
    payload: midiConnection,
    type: UPDATE_MIDI_CONNECTION
});
