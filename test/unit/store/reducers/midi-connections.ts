import { IMidiConnection } from '../../../../src/app/interfaces';
import { midiConnectionsReducer } from '../../../../src/app/store/reducers';

// @todo 'deep-freeze-strict' can't be imported as module.
const deepFreeze = require('deep-freeze-strict'); // tslint:disable-line:no-var-requires no-require-imports

describe('midiConnections reducer', () => {

    describe('with an undefined state', () => {

        describe('with an empty action', () => {

            it('should return the default state', () => {
                const state = midiConnectionsReducer(undefined, <any> deepFreeze({ }));

                expect(state).toEqual([ ]);
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

        let previousState: IMidiConnection[];

        beforeEach(() => {
            previousState = deepFreeze([ {
                isConnected: false,
                midiOutputId: 'a fake midiOutputId',
                midiOutputName: 'a fake midiOutputName',
                name: 'a fake name',
                sourceId: 'a fake sourceId'
            } ]);
        });

        describe('with an empty action', () => {

            it('should return the previous state', () => {
                const state = midiConnectionsReducer(previousState, <any> deepFreeze({ }));

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
                const state = midiConnectionsReducer(previousState, deepFreeze({
                    payload: midiConnection,
                    type: 'UPDATE_MIDI_CONNECTION'
                }));

                expect(state).toEqual([ { ...previousState[0], ...midiConnection } ]);
            });

        });

    });

});
