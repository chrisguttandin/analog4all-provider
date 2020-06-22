import { env } from 'process';
import { browser, logging } from 'protractor';
import { HomePage } from './home.po';

describe('/', () => {
    let page: HomePage;

    afterEach(async () => {
        try {
            // Assert that there are no errors emitted from the browser
            const logs = await browser.manage().logs().get(logging.Type.BROWSER);

            expect(logs).not.toContain(
                jasmine.objectContaining(<Partial<logging.Entry>>{
                    level: logging.Level.SEVERE
                })
            );
        } catch (err) {
            // @todo The driver for Safari does not support to retrieve the logs.
            if (err.name === 'UnsupportedOperationError') {
                console.warn('The driver for Safari does not support to retrieve the logs.'); // tslint:disable-line:no-console
            } else {
                throw err;
            }
        }
    });

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
        let virtualMidiInput: { closePort(): void; openVirtualPort(name: string): void };

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
