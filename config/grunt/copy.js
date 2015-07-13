'use strict';

module.exports = {
    build: {
        files: [{
            cwd: 'app/scripts',
            dest: 'build/scripts',
            expand: true,
            src: [
                'recorder-worker.js',
                'recorder.js'
            ]
        }]
    }
};
