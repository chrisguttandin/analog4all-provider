module.exports = {
    analyze: {
        cmd: 'ng build --aot --prod --sourcemaps --stats-json && (bundle-buddy build/*.map & webpack-bundle-analyzer build/stats.json)'
    },
    build: {
        cmd: 'ng build --aot --base-href /analog4all-provider --no-sourcemap --prod'
    },
    continuous: {
        cmd: 'ng test'
    },
    e2e: {
        cmd: 'ng e2e'
    },
    lint: {
        cmd: 'ng lint --type-check'
    },
    monitor: {
        cmd: 'ng serve --port 8833'
    },
    preview: {
        cmd: 'ng serve --aot --port 8833 --prod'
    },
    smoke: {
        cmd: 'IS_SMOKE_TEST=true ng e2e --serve false'
    },
    test: {
        cmd: 'ng test --watch false'
    }
};
