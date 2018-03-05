module.exports = {
    default: {
        options: {
            failOnUnusedDeps: true,
            ignoreDirs: [
                'build'
            ],
            ignoreMatches: [
                '@angular/router',
                // @todo midi-json-parser-worker is actually used but gets detected as unused for some reason.
                'midi-json-parser-worker',
                'tslib',
                '@angular/cli',
                '@angular/compiler-cli',
                '@angular/language-service',
                '@commitlint/cli',
                '@commitlint/config-angular',
                '@ngrx/store-devtools',
                '@types/*',
                'axe-core',
                'bundle-buddy',
                'commitizen',
                'eslint',
                'eslint-config-holy-grail',
                'greenkeeper-lockfile',
                'grunt-*',
                'husky',
                'jasmine-core',
                'karma*',
                'ngrx-store-freeze',
                'sonarwhal',
                'stylelint-config-holy-grail',
                'tsconfig-holy-grail',
                'tslint',
                'tslint-config-holy-grail',
                'typescript',
                'webpack-bundle-analyzer',
                'webpack-stats-duplicates'
            ]
        },
        src: './'
    }
};
