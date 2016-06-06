var midiJsonParser = require('midi-json-parser'),
    MidiPlayer = require('midi-player').MidiPlayer,
    Recorder = require('recorderjs'),
    wrap = require('rxjs-broker').wrap;

class MidiOutputController {

    constructor (fileReceivingService, fileSendingService, instrumentsService, middleC, recordingService, registeringService, samplesService, scale, $scope) {
        this._fileReceivingService = fileReceivingService;
        this._fileSendingService = fileSendingService;
        this._instrumentsService = instrumentsService;
        this._middleC = middleC;
        this._recordingService = recordingService;
        this._registeringService = registeringService;
        this._samplesService = samplesService;
        this._scale = scale;
        this._$scope = $scope;
    }

    $onInit () {
        this.id = this.device.id;
        this._instrument = null;
        this.name = this.device.name;
        this.playState = 'stopped';
        this.registerState = 'unregistered';
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
            .then(({ connection, instrument }) => {
                this._instrument = instrument;
                this.registerState = 'registered';

                connection
                    .subscribe({
                        next: (dataChannel) => this._render(wrap(dataChannel))
                    });
            })
            .catch(() => this.registerState = 'unregistered')
            .then(() => this._$scope.$evalAsync());
    }

    async _render (dataChannelSubject) {
        var arrayBuffer,
            midiFile,
            midiPlayer;

        try {
            arrayBuffer = await this._fileReceivingService.receive(dataChannelSubject);
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
            var allowedEvents = [],
                delta = 0;

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
                this._fileSendingService.send(dataChannelSubject, new Blob([waveFile]));

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
