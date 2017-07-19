import { Action } from '@ngrx/store';
import { IMidiConnection } from '../../../interfaces';

export interface IAddMidiConnectionAction extends Action {

    payload: IMidiConnection;

    type: 'ADD_MIDI_CONNECTION';

}
