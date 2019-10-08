import { readFirst } from '@nrwl/nx/testing';
import { BehaviorSubject } from 'rxjs';
import { createInstrumentByIdSelector } from '../../../../src/app/store/selectors';
import { TAppState, TInstrument } from '../../../../src/app/store/types';

describe('instruments selectors', () => {

    describe('without any instrument', () => {

        let instruments: readonly TInstrument[];
        let store: BehaviorSubject<TAppState>;

        beforeEach(() => {
            instruments = [ ];
            store = new BehaviorSubject(<TAppState> { instruments });
        });

        describe('createInstrumentByIdSelector()', () => {

            it('should select the value of null', async () => {
                const id = 'a fake id';
                const slice = await readFirst(createInstrumentByIdSelector(store, id));

                expect(slice).toEqual(null);
            });

        });

    });

    describe('with an instrument', () => {

        let instruments: readonly TInstrument[];
        let store: BehaviorSubject<TAppState>;

        beforeEach(() => {
            instruments = [ {
                created: 1518284684850,
                id: 'a fake id',
                isAvailable: false,
                modified: 1518284684850,
                name: 'a fake name',
                socket: {
                    url: 'a fake socket url'
                }
            } ];
            store = new BehaviorSubject(<TAppState> { instruments });
        });

        describe('createInstrumentByIdSelector()', () => {

            it('should select the instrument with the given id', async () => {
                const slice = await readFirst(createInstrumentByIdSelector(store, instruments[0].id));

                expect(slice).toEqual(instruments[0]);
            });

        });

    });

});
