module.exports = {
    404: {
        files: [
            {
                cwd: 'src/',
                dest: 'build/analog4all-provider/',
                expand: true,
                src: ['404.html']
            }
        ]
    },
    assets: {
        files: [
            {
                cwd: 'build/analog4all-provider/',
                dest: 'build/analog4all-provider/assets/',
                expand: true,
                src: ['*.ico', '*.jpg', '*.png']
            }
        ]
    },
    scripts: {
        files: [
            {
                cwd: 'build/analog4all-provider/',
                dest: 'build/analog4all-provider/scripts/',
                expand: true,
                src: ['**/!(ngsw-worker).js']
            }
        ]
    },
    styles: {
        files: [
            {
                cwd: 'build/analog4all-provider/',
                dest: 'build/analog4all-provider/styles/',
                expand: true,
                src: ['**/*.css']
            }
        ]
    }
};
