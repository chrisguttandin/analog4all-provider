const cspBuilder = require('content-security-policy-builder');
const cspProductionConfig = require('../csp/production');
const crypto = require('crypto');
const fs = require('fs');

// eslint-disable-next-line padding-line-between-statements
const computeHashOfFile = (filename, algorithm, encoding) => {
    const content = fs.readFileSync(filename, 'utf-8');

    return computeHashOfString(content, algorithm, encoding);
};
const computeHashOfString = (string, algorithm, encoding) => {
    return crypto
        .createHash(algorithm)
        .update(string)
        .digest(encoding);
};

module.exports = (grunt) => {
    return {
        'bundle': {
            files: {
                './': [
                    'build/analog4all-provider/main.*.js'
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
                    'build/analog4all-provider/index.html'
                ]
            },
            options: {
                patterns: [ {
                    match: /""\+\({}\[e\]\|\|e\)\+"\."\+{([0-9]+:"[a-f0-9]{20}",?)+}/g,
                    replacement: (match) => match.replace(/^""/g, '"scripts/"')
                } ]
            }
        },
        'csp-production': {
            files: {
                'build/analog4all-provider/index.html': [
                    'build/analog4all-provider/index.html'
                ]
            },
            options: {
                patterns: [ {
                    match: /<meta\shttp-equiv="content-security-policy">/,
                    replacement: () => {
                        const html = fs.readFileSync('build/analog4all-provider/index.html', 'utf-8');
                        const regex = /<script[^>]*?>([^<](.|[\n\r])*?)<\/script>/gm;
                        const scriptHashes = [];

                        let result = regex.exec(html);

                        while (result !== null) {
                            scriptHashes.push(`'sha256-${ computeHashOfString(result[1], 'sha256', 'base64') }'`);

                            result = regex.exec(html);
                        }

                        const cspConfig = {
                            ...cspProductionConfig,
                            directives: {
                                ...cspProductionConfig.directives,
                                'script-src': ('script-src' in cspProductionConfig.directives)
                                    ? (Array.isArray(cspProductionConfig.directives['script-src']))
                                        ? [ ...cspProductionConfig.directives['script-src'], ...scriptHashes ]
                                        : [ cspProductionConfig.directives['script-src'], ...scriptHashes ]
                                    : [ ...scriptHashes ]
                            }
                        };
                        const cspString = cspBuilder(cspConfig);

                        return `<meta content="${ cspString }" http-equiv="content-security-policy">`;
                    }
                } ]
            }
        },
        'manifest': {
            files: {
                './': [
                    'build/analog4all-provider/ngsw.json'
                ]
            },
            options: {
                patterns: [ {
                    match: /assets\/apple-touch-icon\.png/g,
                    replacement: () => grunt.file.expand({ cwd: 'build/analog4all-provider' }, 'assets/*.apple-touch-icon.png')[0]
                }, {
                    match: /assets\/favicon\.ico/g,
                    replacement: () => grunt.file.expand({ cwd: 'build/analog4all-provider' }, 'assets/*.favicon.ico')[0]
                }, {
                    match: /\/([a-z0-9-]+\.[a-z0-9]*\.css)"/g,
                    replacement: (_, filename) => `/styles/${ filename }"`
                }, {
                    match: /\/([a-z0-9-]+\.[a-z0-9]*\.js)"/g,
                    replacement: (_, filename) => `/scripts/${ filename }"`
                }, {
                    match: /[\s]*"\/analog4all-provider(\/scripts)?\/runtime\.[a-z0-9]+.js",/g,
                    replacement: ''
                }, {
                    match: /[\s]*"\/analog4all-provider(\/scripts)?\/runtime\.[a-z0-9]+.js":\s"[a-z0-9]+",/g,
                    replacement: ''
                }, {
                    // Replace the hash value inside of the hashTable for "/scripts/main.*.js" because it was modified before.
                    match: /"\/analog4all-provider(\/scripts\/main\.[a-z0-9]+.js)":\s"[a-z0-9]+"/g,
                    replacement: (_, filename) => {
                        return `"/analog4all-provider${ filename }": "${ computeHashOfFile(`build/analog4all-provider${ filename }`, 'sha1', 'hex') }"`;
                    }
                }, {
                    // Replace the hash value inside of the hashTable for "/index.html" because it was modified before.
                    match: /"\/analog4all-provider\/index\.html":\s"[a-z0-9]+"/g,
                    replacement: () => {
                        return `"/analog4all-provider/index.html": "${ computeHashOfFile('build/analog4all-provider/index.html', 'sha1', 'hex') }"`;
                    }
                } ]
            }
        },
        'runtime': {
            files: {
                './': [
                    'build/analog4all-provider/index.html'
                ]
            },
            options: {
                patterns: [ {
                    match: /<script\stype="text\/javascript"\ssrc="(runtime\.[a-z0-9]*\.js)"\sintegrity="sha384-[a-zA-Z0-9+/]*=*"\scrossorigin="anonymous"><\/script>/g,
                    replacement: (match, filename) => {
                        return `<script type="text/javascript">${ fs.readFileSync(`build/analog4all-provider/${ filename }`) }</script>`;
                    }
                } ]
            }
        },
        'scripts': {
            files: {
                './': [
                    'build/analog4all-provider/index.html'
                ]
            },
            options: {
                patterns: [ {
                    match: /<script\stype="text\/javascript"\ssrc="([a-z-]*\.[a-z0-9]*\.js)"\sintegrity="(sha384-[a-zA-Z0-9+/]*=*)"\scrossorigin="anonymous"><\/script>/g,
                    replacement: (match, filename, initialHash) => {
                        const updatedHash = (/main\.[a-z0-9]*\.js/.test(filename)) ?
                            `sha384-${ computeHashOfFile(`build/analog4all-provider/scripts/${ filename }`, 'sha384', 'base64') }` :
                            initialHash;

                        return `<script type="text/javascript" src="scripts/${ filename }" integrity="${ updatedHash }" crossorigin="anonymous"></script>`;
                    }
                } ]
            }
        },
        'styles': {
            files: {
                './': [
                    'build/analog4all-provider/index.html'
                ]
            },
            options: {
                patterns: [ {
                    match: /<link\srel="stylesheet"\shref="(styles\.[a-z0-9]*\.css)"\sintegrity="(sha384-[a-zA-Z0-9+/]*=*)"\scrossorigin="anonymous">/g,
                    replacement: (match, filename, hash) => {
                        return `<link href="styles/${ filename }" rel="stylesheet" integrity="${ hash }" crossorigin="anonymous">`;
                    }
                } ]
            }
        }
    };
};
