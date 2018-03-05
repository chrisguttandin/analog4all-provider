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

    describe('with a MIDI device (at least locally)', () => {

        let virtualMidiInput: { closePort (): void; openVirtualPort (name: string): void; };

        afterEach(() => {
            if (!process.env.TRAVIS) {
                virtualMidiInput.closePort();
            }
        });

        beforeEach(async (done: any) => {
            if (process.env.TRAVIS) {
                done();
            } else {
                const { input } = await import('midi');

                virtualMidiInput = new input();
                virtualMidiInput.openVirtualPort('VirtualSynth');

                setTimeout(done, 1000);
            }
        });

        it('should display the correct sub headline', () => {
            page.navigateTo();

            if (process.env.TRAVIS) {
                expect(page.getSubHeadline()).toEqual('There is currently no instrument connected via MIDI');
            } else {
                expect(page.getSubHeadline()).toEqual('Currently connected MIDI instruments');
            }
        });

    });

});
