'use strict';

module.exports = {
    html: {
        files: [{
            cwd: 'app/',
            dest: 'build/',
            expand: true,
            src: [
                'index.html'
            ]
        }],
        options: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeComments: true
        }
    }
};
