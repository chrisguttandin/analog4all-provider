'use strict';

module.exports = {
    default: {
        files: [{
            dest: 'build/',
            expand: true,
            flatten: true,
            src: [
                'build/index.html'
            ]
        }],
        options: {
            patterns: [{
                match: /scripts\/bundle\.js/g,
                replacement: 'script.js'
            }]
        }
    }
};
