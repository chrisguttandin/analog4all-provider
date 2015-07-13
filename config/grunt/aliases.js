'use strict';

module.exports = {
    build: [
        'clean',
        'copy',
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
