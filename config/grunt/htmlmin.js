module.exports = {
    default: {
        files: [ {
            cwd: 'build/analog4all-provider',
            dest: 'build/analog4all-provider',
            expand: true,
            src: [ '**/*.html' ]
        } ],
        options: {
            caseSensitive: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeComments: true
        }
    }
};
