import { IMidiInput, input } from 'midi';
import { HomePage } from './home.po';

describe('/', () => {

    let page: HomePage;

    beforeEach(() => {
        page = new HomePage();
    });

    it('should display the correct headline', () => {
        page.navigateTo();

        expect(page.getHeadline()).toEqual('Analog4All Provider');
    });

    describe('without any MIDI devices', () => {

        it('should display the correct sub headline', () => {
            page.navigateTo();

            expect(page.getSubHeadline()).toEqual('There is currently no instrument connected via MIDI');
        });

    });

    describe('without a MIDI device', () => {

        let virtualMidiInput: IMidiInput;

        afterEach(() => {
            virtualMidiInput.closePort();
        });

        beforeEach((done: any) => {
            virtualMidiInput = new input();
            virtualMidiInput.openVirtualPort('VirtualSynth');

            setTimeout(done, 1000);
        });

        it('should display the correct sub headline', () => {
            page.navigateTo();

            expect(page.getSubHeadline()).toEqual('Currently connected instruments MIDI');
        });

    });

});
