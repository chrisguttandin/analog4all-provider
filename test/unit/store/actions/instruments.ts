import {
    ADD_INSTRUMENT,
    REMOVE_INSTRUMENT,
    UPDATE_INSTRUMENT,
    addInstrument,
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

    describe('patchInstrument()', () => {

        // ...

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
