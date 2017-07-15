module.exports = {
    default: {
        options: {
            failOnUnusedDeps: true,
            ignoreDirs: [
                'build'
            ],
            ignoreMatches: [
                '@angular/router',
                '@angular/cli',
                '@angular/compiler-cli',
                '@angular/language-service',
                '@types/*',
                'axe-core',
                'chromedriver',
                'eslint-config-holy-grail',
                'greenkeeper-lockfile',
                'grunt-*',
                'husky',
                'jasmine-core',
                'karma*',
                'tslint',
                'tslint-config-holy-grail',
                'typescript',
                'webpack-bundle-analyzer'
            ]
        },
        src: './'
    }
};
