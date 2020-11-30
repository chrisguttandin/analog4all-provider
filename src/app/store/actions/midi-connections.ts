import { createAction } from '@ngrx/store';
import { TIdentifiable, TMidiConnection } from '../types';

export const mergeMidiConnections = createAction('MERGE_MIDI_CONNECTIONS', (midiConnections: readonly TMidiConnection[]) => ({
    payload: midiConnections
}));

export const updateMidiConnection = createAction(
    'UPDATE_MIDI_CONNECTION',
    (midiConnection: TIdentifiable<TMidiConnection, 'midiOutputId'>) => ({ payload: midiConnection })
);
