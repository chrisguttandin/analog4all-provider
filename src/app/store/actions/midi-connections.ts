import { createAction } from '@ngrx/store';
import { IMergeMidiConnectionsAction, IUpdateMidiConnectionAction } from '../interfaces';
import { TIdentifiable, TMidiConnection } from '../types';

export const MERGE_MIDI_CONNECTIONS: IMergeMidiConnectionsAction['type'] = 'MERGE_MIDI_CONNECTIONS';
export const UPDATE_MIDI_CONNECTION: IUpdateMidiConnectionAction['type'] = 'UPDATE_MIDI_CONNECTION';

export const mergeMidiConnections = createAction(MERGE_MIDI_CONNECTIONS, (midiConnections: readonly TMidiConnection[]) => ({
    payload: midiConnections
}));

export const updateMidiConnection = createAction(UPDATE_MIDI_CONNECTION, (
    midiConnection: TIdentifiable<TMidiConnection, 'midiOutputId'>
) => ({ payload: midiConnection }));
