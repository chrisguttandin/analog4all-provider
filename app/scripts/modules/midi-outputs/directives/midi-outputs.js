var fs = require('fs');

module.exports = function () {
    return {
        bindToController: true,
        controller: 'MidiOutputsController',
        controllerAs: 'midiOutputs',
        restrict: 'E',
        template: fs.readFileSync(__dirname + '/../views/midi-outputs.html', 'utf8')
    };
};
