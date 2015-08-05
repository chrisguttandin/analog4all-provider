'use strict';

var Recorder = require('recorderjs'),
    midiJsonParser = require('midi-json-parser'),
    MidiPlayer = require('midi-player').MidiPlayer;

class MidiOutputController {

    constructor (fileReceivingService, fileSendingService, recordingService, registeringService, scale, $scope) {
        this._fileReceivingService = fileReceivingService;
        this._fileSendingService = fileSendingService;
        this.id = this.device.id;
        this._instrument = null;
        this.name = this.device.name;
        this.playState = 'stopped';
        this._recordingService = recordingService;
        this._registeringService = registeringService;
        this.registerState = 'unregistered';
        this._scale = scale;
        this._$scope = $scope;
    }

    deregister () {
        this.registerState = 'unregistered';

        this._registeringService
            .deregister(this._instrument)
            .then(() => {
                this._instrument = null;

                this._$scope.$evalAsync();
            })
            .catch((err) => {
                this.registerState = 'registered';

                this._$scope.$evalAsync();
            });
    }

    register () {
        this.registerState = 'registering';

        this._registeringService
            .register(this.name)
            .then((context) => {
                this._instrument = context.instrument;
                this.registerState = 'registered';

                this._$scope.$evalAsync();

                context.connection.on('channel', ::this._render);
            })
            .catch((err) => {
                this.registerState = 'unregistered';

                this._$scope.$evalAsync();
            });
    }

    async _render (channelBroker) {
        var arrayBuffer,
            midiFile;

        try {
            arrayBuffer = await this._fileReceivingService.receive(channelBroker);
        } catch (err) {
            // @todo

            return;
        }

        try {
            midiFile = await midiJsonParser.parseArrayBuffer(arrayBuffer);
        } catch (err) {
            // @todo

            return;
        }

        this.playState = 'playing';
        this._$scope.$evalAsync();

        await this._recordingService.start();

        var midiPlayer = new MidiPlayer({
                json: midiFile,
                midiOutput: this.device
            });

        midiPlayer.play();

        midiPlayer.on('ended', () => this._recordingService
            .stop()
            .then((waveFile) => {
                this._fileSendingService.send(channelBroker, new Blob([waveFile]));

                this.playState = 'stopped';
                this._$scope.$evalAsync();
            }));
    }

    test () {
        this.playState = 'playing';

        this._recordingService
            .start()
            .then(() => {
                var midiPlayer = new MidiPlayer({
                        json: this._scale,
                        midiOutput: this.device
                    });

                midiPlayer.play();

                midiPlayer.on('ended', () => this._recordingService
                    .stop()
                    .then((blob) => {
                        Recorder.forceDownload(blob, 'test.wav');

                        this.playState = 'stopped';
                        this._$scope.$evalAsync();
                    }));
            });
    }

}

module.exports = MidiOutputController;
