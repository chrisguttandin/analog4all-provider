'use strict';

module.exports = {
    default: {
        files: {
            'app/scripts/bundle.js': [
                'app/scripts/app.js'
            ]
        },
        options: {
            browserifyOptions: {
                fullPaths: false
            }
        }
        // additional configuration is placed inside the package.json file
        // browserify recommends that
    }
};
