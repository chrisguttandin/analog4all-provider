import { WATCH_MIDI_OUTPUTS, watchMidiOutputs } from '../../../../src/app/store/actions';

describe('midiOutputs actions', () => {

    describe('watchMidiOutputs()', () => {

        it('should create an action', () => {
            const action = watchMidiOutputs();

            expect(action).toEqual({ type: WATCH_MIDI_OUTPUTS });
        });

    });

});
