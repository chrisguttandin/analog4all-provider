'use strict';

var Recorder = require('recorderjs'),
    workerTimers = require('worker-timers');

module.exports = class Recording {

    constructor (userMediaService) {
        this._analyser = null;
        this._audioContext = new AudioContext();
        this._recorder = null;
        this._userMediaService = userMediaService;
    }

    _detectSilence (done) {
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

        if (sum < 1) {
            done();
        } else {
            workerTimers.setTimeout(() => this._detectSilence(done), 100);
        }
    }

    _exportAudio () {
        return new Promise((resolve, reject) => {
            this._recorder.stop();
            this._recorder.exportWAV((blob) => {
                this._recorder.clear();

                resolve(blob);
            });
        });
    }

    start () {
        return this._userMediaService
            .getAudioOnlyMediaStream()
            .then((mediaStream) => this._wireInput(mediaStream));
    }

    stop () {
        return this._waitForSilence()
            .then(this._exportAudio.bind(this));
    }

    _waitForSilence (resolve) {
        return new Promise((resolve, reject) => this._detectSilence(resolve));
    }

    _wireInput (mediaStream) {
        var input = this._audioContext.createMediaStreamSource(mediaStream);

        this._analyser = this._audioContext.createAnalyser();

        input.connect(this._analyser);
        this._analyser.connect(this._audioContext.destination);

        this._recorder = new Recorder(this._analyser);

        this._recorder.record();
    }

};
