import deepFreeze from 'deep-freeze-strict';
import { INITIAL_STATE, instrumentsReducer } from '../../../../src/app/store/reducers/instruments';
import { TInstrument, TStoreAction } from '../../../../src/app/store/types';

describe('instruments reducer', () => {
    describe('with an undefined state', () => {
        describe('with an unknown action', () => {
            it('should return the initial state', () => {
                const state = instrumentsReducer(undefined, deepFreeze(<TStoreAction>{}));

                expect(state).toEqual(INITIAL_STATE);
            });
        });

        describe('with an action of type ADD_INSTRUMENT', () => {
            it('should return an array with the given instrument', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(undefined, deepFreeze({ payload: instrument, type: 'ADD_INSTRUMENT' }));

                expect(state).toEqual([instrument]);
            });
        });

        describe('with an action of type DELETE_INSTRUMENT', () => {
            it('should return the initial state', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(undefined, deepFreeze({ payload: instrument, type: 'DELETE_INSTRUMENT' }));

                expect(state).toEqual(INITIAL_STATE);
            });
        });

        describe('with an action of type DELETE_INSTRUMENT_FAIL', () => {
            it('should return the initial state', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(undefined, deepFreeze({ payload: instrument, type: 'DELETE_INSTRUMENT_FAIL' }));

                expect(state).toEqual(INITIAL_STATE);
            });
        });

        describe('with an action of type DELETE_INSTRUMENT_SUCCESS', () => {
            it('should return the initial state', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(undefined, deepFreeze({ payload: instrument, type: 'DELETE_INSTRUMENT_SUCCESS' }));

                expect(state).toEqual(INITIAL_STATE);
            });
        });

        describe('with an action of type PATCH_INSTRUMENT', () => {
            it('should return the initial state', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(undefined, deepFreeze({ payload: instrument, type: 'PATCH_INSTRUMENT' }));

                expect(state).toEqual(INITIAL_STATE);
            });
        });

        describe('with an action of type PATCH_INSTRUMENT_FAIL', () => {
            it('should return the initial state', () => {
                const id = 'a fake id';
                const state = instrumentsReducer(undefined, deepFreeze({ payload: id, type: 'PATCH_INSTRUMENT_FAIL' }));

                expect(state).toEqual(INITIAL_STATE);
            });
        });

        describe('with an action of type PATCH_INSTRUMENT_SUCCESS', () => {
            it('should return the initial state', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(undefined, deepFreeze({ payload: instrument, type: 'PATCH_INSTRUMENT_SUCCESS' }));

                expect(state).toEqual(INITIAL_STATE);
            });
        });

        describe('with an action of type REMOVE_INSTRUMENT', () => {
            it('should throw an error', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };

                expect(() => {
                    instrumentsReducer(undefined, deepFreeze({ payload: instrument, type: 'REMOVE_INSTRUMENT' }));
                }).toThrow(new Error('The instrument to be removed is not stored.'));
            });
        });

        describe('with an action of type UPDATE_INSTRUMENT', () => {
            it('should throw an error', () => {
                const instrument = {
                    id: 'a fake id'
                };

                expect(() => {
                    instrumentsReducer(undefined, deepFreeze({ payload: instrument, type: 'UPDATE_INSTRUMENT' }));
                }).toThrow(new Error('An instrument with the same id is not stored.'));
            });
        });
    });

    describe('with an array of instruments as state', () => {
        let previousState: TInstrument[];

        beforeEach(() => {
            previousState = deepFreeze([
                {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                }
            ]);
        });

        describe('with an unknown action', () => {
            it('should return the previous state', () => {
                const state = instrumentsReducer(previousState, deepFreeze(<TStoreAction>{}));

                expect(state).toEqual(previousState);
            });
        });

        describe('with an action of type ADD_INSTRUMENT', () => {
            it('should throw an error', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };

                expect(() => {
                    instrumentsReducer(previousState, deepFreeze({ payload: instrument, type: 'ADD_INSTRUMENT' }));
                }).toThrow(new Error('An instrument with the same id does already exist.'));
            });
        });

        describe('with an action of type DELETE_INSTRUMENT', () => {
            it('should return the previous state', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(previousState, deepFreeze({ payload: instrument, type: 'DELETE_INSTRUMENT' }));

                expect(state).toEqual(previousState);
            });
        });

        describe('with an action of type DELETE_INSTRUMENT_FAIL', () => {
            it('should return the previous state', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(previousState, deepFreeze({ payload: instrument, type: 'DELETE_INSTRUMENT_FAIL' }));

                expect(state).toEqual(previousState);
            });
        });

        describe('with an action of type DELETE_INSTRUMENT_SUCCESS', () => {
            it('should return the previous state', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(
                    previousState,
                    deepFreeze({
                        payload: instrument,
                        type: 'DELETE_INSTRUMENT_SUCCESS'
                    })
                );

                expect(state).toEqual(previousState);
            });
        });

        describe('with an action of type PATCH_INSTRUMENT', () => {
            it('should return the previous state', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(previousState, deepFreeze({ payload: instrument, type: 'PATCH_INSTRUMENT' }));

                expect(state).toEqual(previousState);
            });
        });

        describe('with an action of type PATCH_INSTRUMENT_FAIL', () => {
            it('should return the previous state', () => {
                const id = 'a fake id';
                const state = instrumentsReducer(previousState, deepFreeze({ payload: id, type: 'PATCH_INSTRUMENT_FAIL' }));

                expect(state).toEqual(previousState);
            });
        });

        describe('with an action of type PATCH_INSTRUMENT_SUCCESS', () => {
            it('should return the previous state', () => {
                const instrument = {
                    created: 1518284684850,
                    id: 'a fake id',
                    isAvailable: false,
                    modified: 1518284684850,
                    name: 'a fake name',
                    socket: {
                        url: 'a fake socket url'
                    }
                };
                const state = instrumentsReducer(
                    previousState,
                    deepFreeze({
                        payload: instrument,
                        type: 'PATCH_INSTRUMENT_SUCCESS'
                    })
                );

                expect(state).toEqual(previousState);
            });
        });

        describe('with an action of type REMOVE_INSTRUMENT', () => {
            it('should return an array without the given instrument', () => {
                const instrument = previousState[0];
                const state = instrumentsReducer(previousState, deepFreeze({ payload: instrument, type: 'REMOVE_INSTRUMENT' }));

                expect(state).toEqual([]);
            });
        });

        describe('with an action of type UPDATE_INSTRUMENT', () => {
            it('should return an updated array of instruments', () => {
                const instrument = {
                    id: 'a fake id',
                    name: 'another fake name'
                };
                const state = instrumentsReducer(previousState, deepFreeze({ payload: instrument, type: 'UPDATE_INSTRUMENT' }));

                expect(state).toEqual([{ ...previousState[0], ...instrument }]);
            });
        });
    });
});
