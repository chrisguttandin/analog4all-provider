import { Action } from '@ngrx/store';
import { IMidiConnection } from '../../../interfaces';

export interface IUpdateMidiConnectionAction extends Action {

    payload: { midiOutputId: IMidiConnection['midiOutputId'] } & Partial<IMidiConnection>;

    type: 'UPDATE_MIDI_CONNECTION';

}
