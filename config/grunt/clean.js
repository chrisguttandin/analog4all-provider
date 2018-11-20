module.exports = {
    runtime: [
        'build/analog4all-provider/runtime.*.js'
    ],
    scripts: [
        'build/analog4all-provider/!(ngsw-worker).js'
    ],
    styles: [
        'build/analog4all-provider/**.css'
    ]
};
