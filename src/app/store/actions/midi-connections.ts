import { IMergeMidiConnectionsAction, IUpdateMidiConnectionAction } from '../interfaces';
import { TIdentifiable, TMidiConnection } from '../types';

export const MERGE_MIDI_CONNECTIONS: IMergeMidiConnectionsAction['type'] = 'MERGE_MIDI_CONNECTIONS';
export const UPDATE_MIDI_CONNECTION: IUpdateMidiConnectionAction['type'] = 'UPDATE_MIDI_CONNECTION';

export const mergeMidiConnections = (midiConnections: TMidiConnection[]): IMergeMidiConnectionsAction => ({
    payload: midiConnections,
    type: MERGE_MIDI_CONNECTIONS
});

export const updateMidiConnection = (midiConnection: TIdentifiable<TMidiConnection, 'midiOutputId'>): IUpdateMidiConnectionAction => ({
    payload: midiConnection,
    type: UPDATE_MIDI_CONNECTION
});
