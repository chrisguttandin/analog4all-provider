'use strict';

module.exports = {
    build: {
        files: [{
            cwd: 'app/scripts/',
            dest: 'build/',
            src: [
                'recorder-worker.js',
                'recorder.js'
            ]
        }]
    }
};
