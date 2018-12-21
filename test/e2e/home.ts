import { env } from 'process';
import { browser } from 'protractor';
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

        let browserName: string;

        beforeEach(async () => {
            const capabilities = await browser.getCapabilities();

            browserName = capabilities.get('browserName');
        });

        it('should display the correct sub headline', () => {
            page.navigateTo();

            if (browserName === 'Safari') {
                expect(page.getParagraph()).toEqual('Sorry, your browser is not supported. :-(');
            } else {
                expect(page.getSubHeadline()).toEqual('There is currently no instrument connected via MIDI');
            }
        });

    });

    describe('with a MIDI device (at least locally)', () => {

        let browserName: string;
        let virtualMidiInput: { closePort (): void; openVirtualPort (name: string): void };

        afterEach(() => {
            if (env.TRAVIS === undefined) {
                virtualMidiInput.closePort();
            }
        });

        beforeEach(async () => {
            const capabilities = await browser.getCapabilities();

            browserName = capabilities.get('browserName');

            if (env.TRAVIS === 'true') {
                return;
            }

            const { input } = await import('midi');

            virtualMidiInput = new input();
            virtualMidiInput.openVirtualPort('VirtualSynth');

            return new Promise((resolve) => setTimeout(resolve, 1000));
        });

        it('should display the correct sub headline', () => {
            page.navigateTo();

            if (browserName === 'Safari') {
                expect(page.getParagraph()).toEqual('Sorry, your browser is not supported. :-(');
            } else if (env.TRAVIS === 'true') {
                expect(page.getSubHeadline()).toEqual('There is currently no instrument connected via MIDI');
            } else {
                expect(page.getSubHeadline()).toEqual('Currently connected MIDI instruments');
            }
        });

    });

});
