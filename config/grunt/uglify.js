'use strict';

module.exports = {
    js: {
        files: {
            'build/script.js': [
                'app/scripts/bundle.js'
            ]
        },
        options: {
            mangle: false
        }
    }
};
