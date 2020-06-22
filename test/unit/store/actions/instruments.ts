import {
    ADD_INSTRUMENT,
    DELETE_INSTRUMENT,
    DELETE_INSTRUMENT_FAIL,
    DELETE_INSTRUMENT_SUCCESS,
    PATCH_INSTRUMENT,
    PATCH_INSTRUMENT_FAIL,
    PATCH_INSTRUMENT_SUCCESS,
    REMOVE_INSTRUMENT,
    UPDATE_INSTRUMENT,
    addInstrument,
    deleteInstrument,
    deleteInstrumentFail,
    deleteInstrumentSuccess,
    patchInstrument,
    patchInstrumentFail,
    patchInstrumentSuccess,
    removeInstrument,
    updateInstrument
} from '../../../../src/app/store/actions';

describe('instruments actions', () => {
    describe('addInstrument()', () => {
        it('should create an action', () => {
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
            const action = addInstrument(instrument);

            expect(action).toEqual({ payload: instrument, type: ADD_INSTRUMENT });
        });
    });

    describe('deleteInstrument()', () => {
        it('should create an action', () => {
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
            const action = deleteInstrument(instrument);

            expect(action).toEqual({ payload: instrument, type: DELETE_INSTRUMENT });
        });
    });

    describe('deleteInstrumentFail()', () => {
        it('should create an action', () => {
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
            const action = deleteInstrumentFail(instrument);

            expect(action).toEqual({ payload: instrument, type: DELETE_INSTRUMENT_FAIL });
        });
    });

    describe('deleteInstrumentSuccess()', () => {
        it('should create an action', () => {
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
            const action = deleteInstrumentSuccess(instrument);

            expect(action).toEqual({ payload: instrument, type: DELETE_INSTRUMENT_SUCCESS });
        });
    });

    describe('patchInstrument()', () => {
        it('should create an action', () => {
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
            const action = patchInstrument(instrument);

            expect(action).toEqual({ payload: instrument, type: PATCH_INSTRUMENT });
        });
    });

    describe('patchInstrumentFail()', () => {
        it('should create an action', () => {
            const id = 'a fake id';
            const action = patchInstrumentFail(id);

            expect(action).toEqual({ payload: id, type: PATCH_INSTRUMENT_FAIL });
        });
    });

    describe('patchInstrumentSuccess()', () => {
        it('should create an action', () => {
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
            const action = patchInstrumentSuccess(instrument);

            expect(action).toEqual({ payload: instrument, type: PATCH_INSTRUMENT_SUCCESS });
        });
    });

    describe('removeInstrument()', () => {
        it('should create an action', () => {
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
            const action = removeInstrument(instrument);

            expect(action).toEqual({ payload: instrument, type: REMOVE_INSTRUMENT });
        });
    });

    describe('updateInstrument()', () => {
        it('should create an action', () => {
            const instrument = {
                id: 'a fake id',
                name: 'a fake name'
            };
            const action = updateInstrument(instrument);

            expect(action).toEqual({ payload: instrument, type: UPDATE_INSTRUMENT });
        });
    });
});
