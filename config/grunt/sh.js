module.exports = {
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
        cmd: 'ng lint'
    },
    monitor: {
        cmd: 'ng serve --port 8833'
    },
    preview: {
        cmd: 'ng serve --aot --port 8833 --prod'
    },
    test: {
        cmd: 'ng test --watch false'
    }
};
