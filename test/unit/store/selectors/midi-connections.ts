import { IMidiConnection } from '../../../../src/app/interfaces';
import { IAppState } from '../../../../src/app/store/interfaces';
import { createMidiConnectionByMidiOutputIdSelector, selectMidiConnections } from '../../../../src/app/store/selectors';

describe('midiConnections selectors', () => {

    describe('without any midiConnection', () => {

        let midiConnections: IMidiConnection[];

        beforeEach(() => {
            midiConnections = [ ];
        });

        describe('createMidiConnectionByMidiOutputIdSelector()', () => {

            it('should select the value of null', () => {
                const id = 'a fake id';
                const selector = createMidiConnectionByMidiOutputIdSelector(id);
                const slice = selector(<IAppState> { midiConnections });

                expect(slice).toEqual(null);
            });

        });

        describe('selectMidiConnections()', () => {

            it('should select the value of midiConnections', () => {
                const slice = selectMidiConnections(<IAppState> { midiConnections });

                expect(slice).toEqual(midiConnections);
            });

        });

    });

    describe('with an midiConnection', () => {

        let midiConnections: IMidiConnection[];

        beforeEach(() => {
            midiConnections = [ {
                isConnected: false,
                midiOutputId: 'a fake midiOutputId',
                midiOutputName: 'a fake midiOutputName',
                name: 'a fake name',
                sourceId: 'a fake sourceId'
            } ];
        });

        describe('createMidiConnectionByMidiOutputIdSelector()', () => {

            it('should select the midiConnection with the given midiOutputId', () => {
                const selector = createMidiConnectionByMidiOutputIdSelector(midiConnections[0].midiOutputId);
                const slice = selector(<IAppState> { midiConnections });

                expect(slice).toEqual(midiConnections[0]);
            });

        });

        describe('selectMidiConnections()', () => {

            it('should select the value of midiConnections', () => {
                const slice = selectMidiConnections(<IAppState> { midiConnections });

                expect(slice).toEqual(midiConnections);
            });

        });

    });

});
