import { Action } from '@ngrx/store';

export interface IUpdateMidiOutputsAction extends Action {

    payload: WebMidi.MIDIOutput[];

    type: 'UPDATE_MIDI_OUTPUTS';

}
