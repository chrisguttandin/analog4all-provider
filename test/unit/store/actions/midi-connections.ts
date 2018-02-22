import { UPDATE_MIDI_CONNECTION, updateMidiConnection } from '../../../../src/app/store/actions';

describe('midiConnections actions', () => {

    describe('updateMidiConnection()', () => {

        it('should create an action', () => {
            const midiConnection = {
                midiOutputId: 'a fake midiOutputId',
                name: 'a fake name'
            };
            const action = updateMidiConnection(midiConnection);

            expect(action).toEqual({ payload: midiConnection, type: UPDATE_MIDI_CONNECTION });
        });

    });

});
