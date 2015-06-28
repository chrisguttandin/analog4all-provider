'use strict';

var MidiPlayer = require('midi-player').MidiPlayer;

class MidiOutputController {

    constructor (scale, $scope) {
        this.isPlaying = false;
        this._scale = scale;
        this._$scope = $scope;
    }

    get name () {
        return this.device.name;
    }

    test () {
        var midiPlayer = new MidiPlayer({
                json: this._scale,
                midiOutput: this.device
            });

        midiPlayer.play();

        this.isPlaying = true;

        midiPlayer.on('ended', () => {
            this.isPlaying = false;

            this._$scope.$evalAsync();
        });
    }

}

module.exports = MidiOutputController;
