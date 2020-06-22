import { Action } from '@ngrx/store';
import { TIdentifiable, TMidiConnection } from '../../types';

export interface IUpdateMidiConnectionAction extends Action {
    readonly payload: TIdentifiable<TMidiConnection, 'midiOutputId'>;

    type: 'UPDATE_MIDI_CONNECTION';
}
