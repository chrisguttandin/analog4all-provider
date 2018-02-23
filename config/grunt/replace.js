const cspBuilder = require('content-security-policy-builder');
const crypto = require('crypto');
const fs = require('fs');
const cspProductionConfig = require('../csp/production');

module.exports = (grunt) => {
    return {
        'bundle': {
            files: {
                './': [
                    'build/main.*.bundle.js'
                ]
            },
            options: {
                patterns: [ {
                    match: /"\/ngsw-worker\.js"/g,
                    replacement: '"/analog4all-provider/ngsw-worker.js"'
                } ]
            }
        },
        'chunks': {
            files: {
                './': [
                    'build/index.html'
                ]
            },
            options: {
                patterns: [ {
                    match: /""\+e\+"\."\+{([0-9]+:"[a-f0-9]{20}",?)+}/g,
                    replacement: (match) => match.replace(/""\+e\+"/g, '"scripts/"+e+"')
                } ]
            }
        },
        'csp-production': {
            files: {
                'build/index.html': [
                    'build/index.html'
                ]
            },
            options: {
                patterns: [ {
                    match: /<meta\shttp-equiv="content-security-policy">/,
                    replacement: () => {
                        const html = fs.readFileSync('build/index.html', 'utf-8');
                        const regex = /<script[^>]*?>([^<](.|[\n\r])*?)<\/script>/gm;
                        const scriptHashes = [];

                        let result = regex.exec(html);

                        while (result !== null) {
                            scriptHashes.push(`'sha256-${ crypto
                                .createHash('sha256')
                                .update(result[1])
                                .digest('base64') }'`);

                            result = regex.exec(html);
                        }

                        const cspConfig = Object.assign({}, cspProductionConfig, {
                            directives: Object.assign({}, cspProductionConfig.directives, {
                                'script-src': ('script-src' in cspProductionConfig.directives)
                                    ? (Array.isArray(cspProductionConfig.directives['script-src']))
                                        ? [ ...cspProductionConfig.directives['script-src'], ...scriptHashes ]
                                        : [ cspProductionConfig.directives['script-src'], ...scriptHashes ]
                                    : [ ...scriptHashes ]
                            })
                        });
                        const cspString = cspBuilder(cspConfig);

                        return `<meta content="${ cspString }" http-equiv="content-security-policy">`;
                    }
                } ]
            }
        },
        'inline': {
            files: {
                './': [
                    'build/index.html'
                ]
            },
            options: {
                patterns: [ {
                    match: /<script\stype="text\/javascript"\ssrc="(inline\.[a-z0-9]*\.bundle\.js)"><\/script>/g,
                    replacement: (match, filename) => {
                        return `<script type="text/javascript">${ fs.readFileSync(`build/${ filename }`) }</script>`;
                    }
                } ]
            }
        },
        'manifest': {
            files: {
                './': [
                    'build/ngsw.json'
                ]
            },
            options: {
                patterns: [ {
                    match: /assets\/apple-touch-icon\.png/g,
                    replacement: () => grunt.file.expand({ cwd: 'build' }, 'assets/*.apple-touch-icon.png')[0]
                }, {
                    match: /assets\/favicon\.ico/g,
                    replacement: () => grunt.file.expand({ cwd: 'build' }, 'assets/*.favicon.ico')[0]
                }, {
                    match: /\/([a-z0-9-]+\.[a-z0-9]*\.bundle\.css)"/g,
                    replacement: (_, filename) => `/styles/${ filename }"`
                }, {
                    match: /\/([a-z0-9-]+\.[a-z0-9]*\.(bundle|chunk)\.js)"/g,
                    replacement: (_, filename) => `/scripts/${ filename }"`
                }, {
                    match: /[\s]*"\/analog4all-provider(\/scripts)?\/inline\.[a-z0-9]+.bundle.js",/g,
                    replacement: ''
                }, {
                    match: /[\s]*"\/analog4all-provider(\/scripts)?\/inline\.[a-z0-9]+.bundle.js":\s"[a-z0-9]+",/g,
                    replacement: ''
                }, {
                    // Replace the hash value inside of the hashTable for "/scripts/main.*.bundle.js" because it was modified before.
                    match: /"\/analog4all-provider(\/scripts\/main\.[a-z0-9]+.bundle.js)":\s"[a-z0-9]+"/g,
                    replacement: (_, filename) => {
                        const content = fs.readFileSync(`build${ filename }`, 'utf-8');
                        const hash = crypto
                            .createHash('sha1')
                            .update(content)
                            .digest('hex');

                        return `"/analog4all-provider${ filename }": "${ hash }"`;
                    }
                }, {
                    // Replace the hash value inside of the hashTable for "/index.html" because it was modified before.
                    match: /"\/analog4all-provider\/index\.html":\s"[a-z0-9]+"/g,
                    replacement: () => {
                        const content = fs.readFileSync('build/index.html', 'utf-8');
                        const hash = crypto
                            .createHash('sha1')
                            .update(content)
                            .digest('hex');

                        return `"/analog4all-provider/index.html": "${ hash }"`;
                    }
                } ]
            }
        },
        'scripts': {
            files: {
                './': [
                    'build/index.html'
                ]
            },
            options: {
                patterns: [ {
                    match: /<script\stype="text\/javascript"\ssrc="([a-z-]*\.[a-z0-9]*\.bundle\.js)"><\/script>/g,
                    replacement: (match, filename) => {
                        return `<script type="text/javascript" src="scripts/${ filename }"></script>`;
                    }
                } ]
            }
        },
        'styles': {
            files: {
                './': [
                    'build/index.html'
                ]
            },
            options: {
                patterns: [ {
                    match: /<link\shref="(styles\.[a-z0-9]*\.bundle\.css)"\srel="stylesheet"\/>/g,
                    replacement: (match, filename) => {
                        return `<link href="styles/${ filename }" rel="stylesheet">`;
                    }
                } ]
            }
        }
    };
};
