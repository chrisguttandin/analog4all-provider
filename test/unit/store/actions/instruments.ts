import {
    ADD_INSTRUMENT,
    DELETE_INSTRUMENT,
    UPDATE_INSTRUMENT,
    addInstrument,
    deleteInstrument,
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

    describe('updateInstrument()', () => {

        it('should create an action', () => {
            const instrument = {
                name: 'a fake name'
            };
            const action = updateInstrument(instrument);

            expect(action).toEqual({ payload: instrument, type: UPDATE_INSTRUMENT });
        });

    });

});
