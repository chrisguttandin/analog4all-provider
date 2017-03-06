const { SpecReporter } = require('jasmine-spec-reporter');
const tsNode = require('ts-node');

exports.config = {

    allScriptsTimeout: 11000,

    baseUrl: 'http://localhost:8833/',

    beforeLaunch () {
        tsNode.register({
            project: 'test/e2e'
        });
    },

    capabilities: {
        browserName: 'chrome'
    },

    directConnect: true,

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        print () {},
        showColors: true
    },

    onPrepare () {
        jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } })); // eslint-disable-line no-undef
    },

    specs: [
        '../../test/e2e/**/*.ts'
    ]

};
