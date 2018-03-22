const { SpecReporter } = require('jasmine-spec-reporter');
const tsNode = require('ts-node');

// eslint-disable-next-line padding-line-between-statements
const chromeCapabilities = {
    browserName: 'chrome',
    chromeOptions: {
        // @todo Running the tests in headless mode seems to disable the Web MIDI API.
        args: (process.env.TRAVIS) ?
            [ '--device-scale-factor=2', '--disable-gpu', '--force-device-scale-factor=2', '--headless', '--window-size=1024,768' ] :
            [ '--device-scale-factor=2', '--disable-gpu', '--force-device-scale-factor=2', '--window-size=1024,768' ]
    }
};

exports.config = {

    allScriptsTimeout: 11000,

    directConnect: !!process.env.TRAVIS,

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        print () {},
        showColors: true
    },

    multiCapabilities: (process.env.TRAVIS) ?
        [ chromeCapabilities ] :
        [ chromeCapabilities, { browserName: 'safari' } ],

    onPrepare () {
        tsNode.register({
            project: 'test/e2e'
        });

        jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } })); // eslint-disable-line no-undef
    },

    specs: [
        '../../test/e2e/**/*.ts'
    ]

};
