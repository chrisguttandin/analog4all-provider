import deepFreeze from 'deep-freeze-strict';
import { INITIAL_STATE, midiConnectionsReducer } from '../../../../src/app/store/reducers/midi-connections';
import { TMidiConnection, TStoreAction } from '../../../../src/app/store/types';

describe('midiConnections reducer', () => {
    describe('with an undefined state', () => {
        describe('with an empty action', () => {
            it('should return the initial state', () => {
                const state = midiConnectionsReducer(undefined, deepFreeze(<TStoreAction>{}));

                expect(state).toEqual(INITIAL_STATE);
            });
        });

        describe('with an action of type MERGE_MIDI_CONNECTIONS', () => {
            // @todo
        });

        describe('with an action of type UPDATE_MIDI_CONNECTION', () => {
            it('should throw an error', () => {
                const midiConnection = {
                    midiOutputId: 'a fake midiOutputId'
                };

                expect(() => {
                    midiConnectionsReducer(undefined, deepFreeze({ payload: midiConnection, type: 'UPDATE_MIDI_CONNECTION' }));
                }).toThrow(new Error('An midiConnection with the same id is not stored.'));
            });
        });
    });

    describe('with an array of midiConnections as state', () => {
        let previousState: TMidiConnection[];

        beforeEach(() => {
            previousState = deepFreeze([
                {
                    isConnected: false,
                    midiOutputId: 'a fake midiOutputId',
                    midiOutputName: 'a fake midiOutputName',
                    name: 'a fake name',
                    sourceId: 'a fake sourceId'
                }
            ]);
        });

        describe('with an empty action', () => {
            it('should return the previous state', () => {
                const state = midiConnectionsReducer(previousState, deepFreeze(<TStoreAction>{}));

                expect(state).toEqual(previousState);
            });
        });

        describe('with an action of type MERGE_MIDI_CONNECTIONS', () => {
            // @todo
        });

        describe('with an action of type UPDATE_MIDI_CONNECTION', () => {
            it('should return an updated array of midiConnections', () => {
                const midiConnection = {
                    midiOutputId: 'a fake midiOutputId',
                    sourceId: 'another fake sourceId'
                };
                const state = midiConnectionsReducer(
                    previousState,
                    deepFreeze({
                        payload: midiConnection,
                        type: 'UPDATE_MIDI_CONNECTION'
                    })
                );

                expect(state).toEqual([{ ...previousState[0], ...midiConnection }]);
            });
        });
    });
});
