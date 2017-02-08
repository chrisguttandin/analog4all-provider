module.exports = {
    default: {
        options: {
            failOnUnusedDeps: true,
            ignoreMatches: [
                '@angular/router',
                '@angular/cli',
                '@angular/compiler-cli',
                '@types/*',
                'eslint-config-holy-grail',
                'grunt-*',
                'husky',
                'jasmine',
                'karma*',
                'tslint-config-holy-grail',
                'typescript'
            ]
        },
        src: './'
    }
};
