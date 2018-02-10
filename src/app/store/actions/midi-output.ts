import { IUpdateMidiOutputsAction } from '../interfaces';

export const UPDATE_MIDI_OUTPUTS: IUpdateMidiOutputsAction['type'] = 'UPDATE_MIDI_OUTPUTS';

export const updateMidiOutputs = (midiOutputs: WebMidi.MIDIOutput[]): IUpdateMidiOutputsAction => ({
    payload: midiOutputs,
    type: UPDATE_MIDI_OUTPUTS
});
