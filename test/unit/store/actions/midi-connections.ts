import {
    MERGE_MIDI_CONNECTIONS,
    UPDATE_MIDI_CONNECTION,
    mergeMidiConnections,
    updateMidiConnection
} from '../../../../src/app/store/actions';

describe('midiConnections actions', () => {
    describe('mergeMidiConnections()', () => {
        it('should create an action', () => {
            const midiConnections = [
                {
                    isConnected: true,
                    midiOutputId: 'a fake midiOutputId',
                    midiOutputName: 'a fake midiOutputName',
                    name: 'a fake name',
                    sourceId: 'default'
                }
            ];
            const action = mergeMidiConnections(midiConnections);

            expect(action).toEqual({ payload: midiConnections, type: MERGE_MIDI_CONNECTIONS });
        });
    });

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
