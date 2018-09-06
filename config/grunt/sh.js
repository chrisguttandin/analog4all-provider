const { env } = require('process');

module.exports = {
    analyze: {
        cmd: 'ng build --aot --build-optimizer --prod --sourcemaps --stats-json && (bundle-buddy build/*.map & webpack-bundle-analyzer build/stats.json)'
    },
    build: {
        cmd: 'ng build --aot --base-href /analog4all-provider/ --build-optimizer --no-sourcemaps --prod --stats-json --subresource-integrity && webpack-stats-duplicates build/stats.json && rm build/stats.json'
    },
    continuous: {
        cmd: 'ng test'
    },
    e2e: {
        cmd: (env.TRAVIS) ?
            'ng e2e --aot' :
            'webdriver-manager update && ng e2e --aot --no-webdriver-update'
    },
    lint: {
        cmd: 'ng lint --type-check'
    },
    monitor: {
        cmd: 'ng serve --aot --port 8833'
    },
    preview: {
        cmd: 'ng serve --aot --build-optimizer --port 8833 --prod'
    },
    smoke: {
        cmd: (env.TRAVIS) ?
            'IS_SMOKE_TEST=true ng e2e --serve false && hint https://chrisguttandin.github.io/analog4all-provider && rm cdp.pid' :
            'webdriver-manager update && IS_SMOKE_TEST=true ng e2e --no-webdriver-update --serve false && hint https://chrisguttandin.github.io/analog4all-provider && rm cdp.pid'
    },
    test: {
        cmd: 'ng test --watch false'
    }
};
