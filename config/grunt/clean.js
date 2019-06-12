module.exports = {
    'runtime': [
        'build/analog4all-provider/runtime-es*.js'
    ],
    'scripts': [
        'build/analog4all-provider/!(ngsw-worker).js'
    ],
    'source-maps': [
        'build/analog4all-provider/**.map'
    ],
    'styles': [
        'build/analog4all-provider/**.css'
    ]
};
