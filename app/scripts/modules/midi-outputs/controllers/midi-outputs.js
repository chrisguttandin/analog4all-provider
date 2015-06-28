'use strict';

class MidiOutputsController {

    constructor ($scope) {
        if (window.navigator && window.navigator.requestMIDIAccess) {
            window.navigator
                .requestMIDIAccess()
                .then((midiAccess) => {
                    this._queryOutputDevices(midiAccess);

                    midiAccess.onstatechange = (event) => this._queryOutputDevices(event.target);
                });
        }

        this.devices = [];
        this._$scope = $scope;
    }

    _queryOutputDevices (midiAccess) {
        this.devices = [];

        midiAccess.outputs.forEach((device) => this.devices.push(device));

        this._$scope.$evalAsync();
    }

}

module.exports = MidiOutputsController;
