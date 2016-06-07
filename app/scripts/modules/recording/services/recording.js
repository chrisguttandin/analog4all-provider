import Recorder from 'recorderjs';
import { setTimeout } from 'worker-timers';

export class RecordingService {

    constructor (userMediaService) {
        this._analyser = null;
        this._audioContext = new AudioContext();
        this._recorder = null;
        this._userMediaService = userMediaService;
    }

    _detectSilence (done, attempt) {
        var dataArray,
            fftSize,
            i,
            sum = 0;

        fftSize = this._analyser.fftSize;
        dataArray = new Float32Array(fftSize);
        this._analyser.getFloatTimeDomainData(dataArray);

        for (i = 0; i < fftSize; i += 1) {
            sum += Math.abs(dataArray[i]);
        }

        if (sum < Math.pow(attempt, 2) / 1000) {
            done();
        } else {
            setTimeout(() => this._detectSilence(done, attempt + 1), 100);
        }
    }

    _exportAudio () {
        return new Promise((resolve) => {
            this._recorder.stop();
            this._recorder.exportWAV((blob) => {
                this._recorder.clear();

                resolve(blob);
            });
        });
    }

    start (channels = 2) {
        return this._userMediaService
            .getAudioOnlyMediaStream()
            .then((mediaStream) => this._wireInput(mediaStream, channels));
    }

    stop () {
        return this._waitForSilence()
            .then(this._exportAudio.bind(this));
    }

    _waitForSilence () {
        return new Promise((resolve) => this._detectSilence(resolve, 0));
    }

    _wireInput (mediaStream, channels) {
        var input = this._audioContext.createMediaStreamSource(mediaStream);

        this._analyser = this._audioContext.createAnalyser();

        input.connect(this._analyser);
        this._analyser.connect(this._audioContext.destination);

        this._recorder = new Recorder(this._analyser, {
            numChannels: channels
        });

        this._recorder.record();
    }

}
