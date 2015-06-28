'use strict';

module.exports = {
    html: {
        files: [
            'app/**/*.html'
        ],
        options: {
            livereload: true
        },
        tasks: [
            'js'
        ]
    },
    js: {
        files: [
            'app/scripts/**/*.js',
            '!app/scripts/bundle.js'
        ],
        options: {
            livereload: true,
        },
        tasks: [
            'js'
        ]
    }
};
