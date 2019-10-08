import { readFirst } from '@nrwl/nx/testing';
import { BehaviorSubject } from 'rxjs';
import { createMidiConnectionByMidiOutputIdSelector, createMidiConnectionsSelector } from '../../../../src/app/store/selectors';
import { TAppState, TMidiConnection } from '../../../../src/app/store/types';

describe('midiConnections selectors', () => {

    describe('without any midiConnection', () => {

        let midiConnections: readonly TMidiConnection[];
        let store: BehaviorSubject<TAppState>;

        beforeEach(() => {
            midiConnections = [ ];
            store = new BehaviorSubject(<TAppState> { midiConnections });
        });

        describe('createMidiConnectionByMidiOutputIdSelector()', () => {

            it('should select the value of null', async () => {
                const id = 'a fake id';
                const slice = await readFirst(createMidiConnectionByMidiOutputIdSelector(store, id));

                expect(slice).toEqual(null);
            });

        });

        describe('createMidiConnectionsSelector()', () => {

            it('should select the value of midiConnections', async () => {
                const slice = await readFirst(createMidiConnectionsSelector(store));

                expect(slice).toEqual(midiConnections);
            });

        });

    });

    describe('with an midiConnection', () => {

        let midiConnections: readonly TMidiConnection[];
        let store: BehaviorSubject<TAppState>;

        beforeEach(() => {
            midiConnections = [ {
                isConnected: false,
                midiOutputId: 'a fake midiOutputId',
                midiOutputName: 'a fake midiOutputName',
                name: 'a fake name',
                sourceId: 'a fake sourceId'
            } ];
            store = new BehaviorSubject(<TAppState> { midiConnections });
        });

        describe('createMidiConnectionByMidiOutputIdSelector()', () => {

            it('should select the midiConnection with the given midiOutputId', async () => {
                const slice = await readFirst(createMidiConnectionByMidiOutputIdSelector(store, midiConnections[0].midiOutputId));

                expect(slice).toEqual(midiConnections[0]);
            });

        });

        describe('createMidiConnectionsSelector()', () => {

            it('should select the value of midiConnections', async () => {
                const slice = await readFirst(createMidiConnectionsSelector(store));

                expect(slice).toEqual(midiConnections);
            });

        });

    });

});
