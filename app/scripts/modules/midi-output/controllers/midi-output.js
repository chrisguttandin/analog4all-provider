import { MidiPlayer } from 'midi-player';
import Recorder from 'recorderjs';
import { concatMap } from 'rxjs/operator/concatMap';
import { wrap } from 'rxjs-broker';

export class MidiOutputController {

    constructor (fileReceivingService, fileSendingService, instrumentsService, middleC, recordingService, registeringService, renderingService, samplesService, scale, $scope) {
        this._fileReceivingService = fileReceivingService;
        this._fileSendingService = fileSendingService;
        this._instrumentsService = instrumentsService;
        this._middleC = middleC;
        this._recordingService = recordingService;
        this._registeringService = registeringService;
        this._renderingService = renderingService;
        this._samplesService = samplesService;
        this._scale = scale;
        this._$scope = $scope;
    }

    $onInit () {
        this._instrument = null;
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
            .register(this.device.name)
            .then(({ connection, instrument }) => {
                this._instrument = instrument;
                this.registerState = 'registered';

                connection
                    ::concatMap(async (dataChannel) => {
                        await this._renderingService.render(wrap(dataChannel), this.device);

                        return dataChannel;
                    })
                    .subscribe({
                        next (dataChannel) {
                            dataChannel.close();
                        }
                    });
            })
            .catch(() => this.registerState = 'unregistered')
            .then(() => this._$scope.$evalAsync());
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
