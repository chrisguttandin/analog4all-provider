import { UPDATE_MIDI_OUTPUTS, updateMidiOutputs } from '../../../../src/app/store/actions';

describe('midiOutputs actions', () => {

    describe('updateMidiOutputs()', () => {

        it('should create an action', () => {
            const midiOutputs = <WebMidi.MIDIOutput[]> [ ];
            const action = updateMidiOutputs(midiOutputs);

            expect(action).toEqual({ payload: midiOutputs, type: UPDATE_MIDI_OUTPUTS });
        });

    });

});
