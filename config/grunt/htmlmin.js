module.exports = {
    default: {
        files: [
            {
                cwd: 'build/analog4all-provider/browser',
                dest: 'build/analog4all-provider/browser',
                expand: true,
                src: ['**/*.html']
            }
        ],
        options: {
            caseSensitive: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeComments: true
        }
    }
};
