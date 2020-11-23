module.exports = {
    default: {
        options: {
            failOnUnusedDeps: true,
            ignoreDirs: ['build'],
            ignoreMatches: [
                '@angular/router',
                // @todo extendable-media-recorder is actually used but gets detected as unused for some reason.
                'extendable-media-recorder',
                // @todo extendable-media-recorder-wav-encoder is actually used but gets detected as unused for some reason.
                'extendable-media-recorder-wav-encoder',
                // @todo midi-json-parser-worker is actually used but gets detected as unused for some reason.
                'midi-json-parser-worker',
                'tslib',
                '@angular/cli',
                '@angular/compiler-cli',
                '@angular/language-service',
                '@angular-devkit/build-angular',
                '@commitlint/cli',
                '@commitlint/config-angular',
                '@hint/*',
                '@ngrx/store-devtools',
                '@nrwl/nx',
                '@types/*',
                'axe-core',
                'bundle-buddy',
                'commitizen',
                // @todo deep-freeze-strict is actually used but gets detected as unused for some reason.
                'deep-freeze-strict',
                'eslint',
                'eslint-config-holy-grail',
                'grunt-*',
                'hint',
                'htmlhint',
                'husky',
                'jasmine-core',
                'jasmine-marbles',
                'karma*',
                'midi',
                'ngrx-store-freeze',
                'prettier',
                'pretty-quick',
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
