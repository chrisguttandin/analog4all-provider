'use strict';

module.exports = {
    build: [
        'clean',
        'js',
        'htmlmin',
        'replace',
        'uglify',
        'buildGhPages'
    ],
    js: [
        'browserify'
    ],
    preview: [
        'js',
        'connect',
        'watch'
    ]
};
