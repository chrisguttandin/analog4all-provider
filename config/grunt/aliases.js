'use strict';

module.exports = {
    build: [
        'clean',
        'js',
        'htmlmin',
        'replace',
        'copy',
        // 'uglify',
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
