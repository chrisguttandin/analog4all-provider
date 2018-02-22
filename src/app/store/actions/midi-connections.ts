import { IMidiConnection } from '../../interfaces';
import { IAddMidiConnectionAction, IMergeMidiConnectionsAction, IUpdateMidiConnectionAction } from '../interfaces';

export const ADD_MIDI_CONNECTION: IAddMidiConnectionAction['type'] = 'ADD_MIDI_CONNECTION';
export const MERGE_MIDI_CONNECTIONS: IMergeMidiConnectionsAction['type'] = 'MERGE_MIDI_CONNECTIONS';
export const UPDATE_MIDI_CONNECTION: IUpdateMidiConnectionAction['type'] = 'UPDATE_MIDI_CONNECTION';

export const addMidiConnection = (midiConnection: IMidiConnection): IAddMidiConnectionAction => ({
    payload: midiConnection,
    type: ADD_MIDI_CONNECTION
});

export const mergeMidiConnections = (midiConnections: IMidiConnection[]): IMergeMidiConnectionsAction => ({
    payload: midiConnections,
    type: MERGE_MIDI_CONNECTIONS
});

export const updateMidiConnection = (
    midiConnection: { midiOutputId: IMidiConnection['midiOutputId'] } & Partial<IMidiConnection>
): IUpdateMidiConnectionAction => ({
    payload: midiConnection,
    type: UPDATE_MIDI_CONNECTION
});
