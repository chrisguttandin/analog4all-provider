import { ADD_MIDI_CONNECTION, UPDATE_MIDI_CONNECTION, addMidiConnection, updateMidiConnection } from '../../../../src/app/store/actions';

describe('midiConnections actions', () => {

    describe('addMidiConnection()', () => {

        it('should create an action', () => {
            const midiConnection = {
                midiOutputId: 'a fake midiOutputId',
                sourceId: 'a fake sourceId'
            };
            const action = addMidiConnection(midiConnection);

            expect(action).toEqual({ payload: midiConnection, type: ADD_MIDI_CONNECTION });
        });

    });

    describe('updateMidiConnection()', () => {

        it('should create an action', () => {
            const midiConnection = {
                midiOutputId: 'a fake midiOutputId'
            };
            const action = updateMidiConnection(midiConnection);

            expect(action).toEqual({ payload: midiConnection, type: UPDATE_MIDI_CONNECTION });
        });

    });

});
