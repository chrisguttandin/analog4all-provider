'use strict';

var fs = require('fs');

module.exports = function () {
    return {
        bindToController: true,
        controller: 'MidiOutputController',
        controllerAs: 'midiOutput',
        require: [
            'device'
        ],
        restrict: 'E',
        scope: {
            device: '='
        },
        template: fs.readFileSync(__dirname + '/../views/midi-output.html', 'utf8')
    };
};
