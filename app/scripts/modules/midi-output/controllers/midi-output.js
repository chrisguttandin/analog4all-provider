'use strict';

var Recorder = require('recorderjs'),
    midiJsonParser = require('midi-json-parser'),
    MidiPlayer = require('midi-player').MidiPlayer;

class MidiOutputController {

    constructor (fileReceivingService, fileSendingService, instrumentsService, middleC, recordingService, registeringService, samplesService, scale, $scope) {
        this._fileReceivingService = fileReceivingService;
        this._fileSendingService = fileSendingService;
        this.id = this.device.id;
        this._instrument = null;
        this._instrumentsService = instrumentsService;
        this._middleC = middleC;
        this.name = this.device.name;
        this.playState = 'stopped';
        this._recordingService = recordingService;
        this._registeringService = registeringService;
        this.registerState = 'unregistered';
        this._samplesService = samplesService;
        this._scale = scale;
        this._$scope = $scope;
    }

    deregister () {
        this.registerState = 'unregistered';

        this._registeringService
            .deregister(this._instrument)
            .then(() => this._instrument = null)
            .catch(() => this.registerState = 'registered')
            .then(() => this._$scope.$evalAsync());
    }

    register () {
        this.registerState = 'registering';

        this._registeringService
            .register(this.name)
            .then((context) => {
                this._instrument = context.instrument;
                this.registerState = 'registered';

                context.connection.on('channel', ::this._render);
            })
            .catch(() => this.registerState = 'unregistered')
            .then(() => this._$scope.$evalAsync());
    }

    async _render (channelBroker) {
        var arrayBuffer,
            midiFile,
            midiPlayer;

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

        midiFile.tracks = midiFile.tracks.map((events) => {
            var delta = 0,
                allowedEvents = [];

            for (let i = 0, length = events.length; i < length; i += 1) {
                let event = events[i];

                if (event.endOfTrack || event.noteOff || event.noteOn || event.setTempo || event.timeSignature || event.trackName) {
                    event.delta = event.delta + delta;
                    allowedEvents.push(event);
                    delta = 0;
                } else {
                    delta += event.delta;
                }
            }

            return allowedEvents;
        });

        this.playState = 'playing';
        this._$scope.$evalAsync();

        await this._recordingService.start();

        midiPlayer = new MidiPlayer({
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

    sample () {
        this.playState = 'playing';

        this._recordingService
            .start(1)
            .then(() => {
                /* eslint-disable indent */
                var midiPlayer = new MidiPlayer({
                        json: this._middleC,
                        midiOutput: this.device
                    });
                /* eslint-enable indent */

                midiPlayer.on('ended', () => this._recordingService
                    .stop()
                    .then((blob) => this._samplesService
                        .create({
                            file: blob
                        }))
                    .then((sample) => this._instrumentsService
                        .update(this._instrument.id, {
                            sample: {
                                id: sample.id
                            }
                        }))
                    .then(() => {
                        this.playState = 'stopped';
                        this._$scope.$evalAsync();
                    }));

                midiPlayer.play();
            });
    }

    test () {
        this.playState = 'playing';

        this._recordingService
            .start()
            .then(() => {
                /* eslint-disable indent */
                var midiPlayer = new MidiPlayer({
                        json: this._scale,
                        midiOutput: this.device
                    });
                /* eslint-enable indent */

                midiPlayer.on('ended', () => this._recordingService
                    .stop()
                    .then((blob) => {
                        Recorder.forceDownload(blob, 'test.wav');

                        this.playState = 'stopped';
                        this._$scope.$evalAsync();
                    }));

                midiPlayer.play();
            });
    }

}

module.exports = MidiOutputController;
