import { test, expect, ConsoleMessage } from '@playwright/test';
import { MidiDst } from 'midi-test';
import { Home } from './home.po';

let home: Home;
let removeListener: () => ConsoleMessage[];

test.afterEach(() => {
    const consoleMessages = removeListener();
    const severeConsoleMessages = consoleMessages.filter(
        (consoleMessage) => !['debug', 'info', 'log', 'warning'].includes(consoleMessage.type())
    );

    // eslint-disable-next-line no-console
    severeConsoleMessages.forEach((consoleMessage) => console.log(`${consoleMessage.type()}: ${consoleMessage.text()}`));

    expect(severeConsoleMessages).toEqual([]);
});

test.beforeEach(async ({ page }) => {
    const consoleMessages: ConsoleMessage[] = [];
    const listener = (consoleMessage) => consoleMessages.push(consoleMessage);

    page.addListener('console', listener);

    removeListener = () => {
        page.removeListener('console', listener);

        return consoleMessages;
    };

    home = new Home(page);

    await home.navigateTo();
});

test('should display the correct headline', async () => {
    await expect(home.getHeadline()).toHaveText('Analog4All Provider');
});

test('should go to the home page', async ({ page }) => {
    await expect(page).toHaveURL(/\/$/);
});

test.describe('without any MIDI devices', () => {
    test('should display the correct sub headline', async ({ browserName }) => {
        if (browserName === 'chromium' || browserName === 'firefox') {
            await expect(home.getSubHeadline()).toHaveText('There is currently no instrument connected via MIDI');
        } else {
            await expect(home.getParagraph()).toHaveText('Sorry, your browser is not supported. :-(');
        }
    });
});

test.describe('with a MIDI device (at least locally)', () => {
    let virtualOutputDevice: InstanceType<typeof MidiDst>;

    test.afterEach(() => virtualOutputDevice.disconnect());

    test.beforeEach(async ({ browserName, context }) => {
        if (browserName === 'chromium') {
            await context.grantPermissions(['midi']);
        }

        virtualOutputDevice = new MidiDst('VirtualSynth');
        virtualOutputDevice.connect();
    });

    test('should display the correct sub headline', async ({ browserName }) => {
        if (browserName === 'chromium') {
            await expect(home.getSubHeadline()).toHaveText('Currently connected MIDI instruments');
        } else if (browserName === 'firefox') {
            await expect(home.getSubHeadline()).toHaveText('There is currently no instrument connected via MIDI');
        } else {
            await expect(home.getParagraph()).toHaveText('Sorry, your browser is not supported. :-(');
        }
    });
});
