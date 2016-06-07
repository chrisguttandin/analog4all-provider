var fs = require('fs');

module.exports = {
    bindings: {
        device: '='
    },
    controller: 'MidiOutputController as vm',
    template: fs.readFileSync(__dirname + '/../views/midi-output.html', 'utf8')
};
