import { IMidiConnection } from '../../../../src/app/interfaces';
import { midiConnectionsReducer } from '../../../../src/app/store/reducers';

describe('midiConnections reducer', () => {

    describe('with an undefined state', () => {

        describe('with an empty action', () => {

            it('should return the default state', () => {
                const state = midiConnectionsReducer(undefined, <any> { });

                expect(state).toEqual([ ]);
            });

        });

        describe('with an action of type ADD_MIDI_CONNECTION', () => {

            it('should return an array with the given midiConnection', () => {
                const midiConnection = {
                    isConnected: false,
                    midiOutputId: 'a fake midiOutputId',
                    midiOutputName: 'a fake midiOutputName',
                    name: 'a fake name',
                    sourceId: 'a fake sourceId'
                };
                const state = midiConnectionsReducer(undefined, { payload: midiConnection, type: 'ADD_MIDI_CONNECTION' });

                expect(state).toEqual([ midiConnection ]);
            });

        });

        describe('with an action of type UPDATE_MIDI_CONNECTION', () => {

            it('should throw an error', () => {
                const midiConnection = {
                    midiOutputId: 'a fake midiOutputId'
                };

                expect(() => {
                    midiConnectionsReducer(undefined, { payload: midiConnection, type: 'UPDATE_MIDI_CONNECTION' });
                }).toThrow(new Error('An midiConnection with the same id is not stored.'));
            });

        });

    });

    describe('with an array of midiConnections as state', () => {

        let previousState: IMidiConnection[];

        beforeEach(() => {
            previousState = [ {
                isConnected: false,
                midiOutputId: 'a fake midiOutputId',
                midiOutputName: 'a fake midiOutputName',
                name: 'a fake name',
                sourceId: 'a fake sourceId'
            } ];
        });

        describe('with an empty action', () => {

            it('should return the previous state', () => {
                const state = midiConnectionsReducer(previousState, <any> { });

                expect(state).toEqual(previousState);
            });

        });

        describe('with an action of type ADD_MIDI_CONNECTION', () => {

            it('should throw an error', () => {
                const midiConnection = {
                    isConnected: false,
                    midiOutputId: 'a fake midiOutputId',
                    midiOutputName: 'a fake midiOutputName',
                    name: 'a fake name',
                    sourceId: 'a fake sourceId'
                };

                expect(() => {
                    midiConnectionsReducer(previousState, { payload: midiConnection, type: 'ADD_MIDI_CONNECTION' });
                }).toThrow(new Error('A midiConnection with the same midiOutputId does already exist.'));
            });

        });

        describe('with an action of type UPDATE_MIDI_CONNECTION', () => {

            it('should return an updated array of midiConnections', () => {
                const midiConnection = {
                    midiOutputId: 'a fake midiOutputId',
                    sourceId: 'another fake sourceId'
                };
                const state = midiConnectionsReducer(previousState, { payload: midiConnection, type: 'UPDATE_MIDI_CONNECTION' });

                expect(state).toEqual([ { ...previousState[0], ...midiConnection } ]);
            });

        });

    });

});
