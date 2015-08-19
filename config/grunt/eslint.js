'use strict';

module.exports = {
    app: {
        options: {
            configFile: 'config/eslint/app.json'
        },
        src: [
            'app/scripts/**/*.js',
            '!app/scripts/bundle.js'
        ]
    },
    config: {
        options: {
            configFile: 'config/eslint/config.json'
        },
        src: [
            '*.js',
            'config/**/*.js'
        ]
    }
};
