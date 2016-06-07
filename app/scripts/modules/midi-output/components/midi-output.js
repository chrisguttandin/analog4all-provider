var fs = require('fs');

export const midiOutput = {
    bindings: {
        device: '='
    },
    controller: 'MidiOutputController as vm',
    template: fs.readFileSync(__dirname + '/../views/midi-output.html', 'utf8')
};
