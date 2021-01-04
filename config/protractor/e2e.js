// @ts-check
const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const { env } = require('process');
const tsNode = require('ts-node');
const { defaultProject, projects } = require('../../angular.json');

// eslint-disable-next-line padding-line-between-statements
const chromeCapabilities = {
    browserName: 'chrome',
    chromeOptions: {
        // @todo Running the tests in headless mode seems to disable the Web MIDI API.
        args: env.CI
            ? [
                  '--device-scale-factor=2',
                  '--disable-gpu',
                  '--enable-features=NetworkService',
                  '--force-device-scale-factor=2',
                  '--force-prefers-reduced-motion',
                  '--headless',
                  '--window-size=1024,768'
              ]
            : [
                  '--device-scale-factor=2',
                  '--disable-gpu',
                  '--enable-features=NetworkService',
                  '--force-device-scale-factor=2',
                  '--force-prefers-reduced-motion',
                  '--window-size=1024,768'
              ]
    }
};

/**
 * @type { import("protractor").Config }
 */
exports.config = {
    SELENIUM_PROMISE_MANAGER: false,

    allScriptsTimeout: 60000,

    baseUrl: env.IS_SMOKE_TEST
        ? 'https://chrisguttandin.github.io/analog4all-provider'
        : `http://localhost:${projects[defaultProject].architect.serve.options.port}`,

    directConnect: !!env.CI,

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000,
        print() {},
        showColors: true
    },

    multiCapabilities: env.CI ? [chromeCapabilities] : [chromeCapabilities, { browserName: 'safari' }],

    onPrepare() {
        // @ts-ignore
        browser.resetUrl = 'about:blank'; // eslint-disable-line no-undef

        tsNode.register({
            project: 'test/e2e/tsconfig.json'
        });

        jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: StacktraceOption.PRETTY } })); // eslint-disable-line no-undef
    },

    suites: {
        e2e: '../../test/e2e/**/*.ts'
    }
};
