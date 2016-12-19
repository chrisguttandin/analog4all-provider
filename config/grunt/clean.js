module.exports = {
    inline: [
        'build/inline.*.bundle.js'
    ],
    scripts: [
        'build/*.bundle.map',
        'build/*.bundle.js',
        'build/*.bundle.js.gz',
        'build/*.chunk.map',
        'build/*.chunk.js',
        'build/*.chunk.js.gz'
    ],
    styles: [
        'build/*.bundle.map',
        'build/*.bundle.css',
        'build/*.bundle.css.gz'
    ]
};
