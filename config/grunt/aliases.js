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
    lint: [
        'eslint'
    ],
    preview: [
        'js',
        'connect',
        'watch'
    ]
};
