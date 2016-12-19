import { Injectable } from '@angular/core';
import { MediaRecorder, extend } from 'extendable-media-recorder';
import { wavEncoder } from 'extendable-media-recorder-wav-encoder';
import { UserMediaService } from './user-media.service';

extend(wavEncoder);

const FADE_OUT_OFFSET = 5;

const FADE_OUT_TICKS = 20;

@Injectable()
export class RecordingService {

    private _analyserNode;

    private _audioContext;

    private _gainNode;

    private _mediaRecorder;

    constructor (private _userMediaService: UserMediaService) {
        this._audioContext = new AudioContext();
    }

    private _detectSilence (currentTime, done, attempt) {
        const fftSize = this._analyserNode.fftSize;

        const tickLength = fftSize / this._audioContext.sampleRate;

        if (this._audioContext.currentTime < currentTime + FADE_OUT_OFFSET) {
            setTimeout(() => this._detectSilence(currentTime, done, attempt), tickLength * 1000);

            return;
        }

        const dataArray = new Float32Array(fftSize);

        this._analyserNode.getFloatTimeDomainData(dataArray);

        let sum = 0;

        for (let i = 0; i < fftSize; i += 1) {
            sum += Math.abs(dataArray[i]);
        }

        if (sum === 0) {
            done();
        } else {
            const gain = (attempt > FADE_OUT_TICKS) ? 0 : 1 - Math.pow((attempt / FADE_OUT_TICKS), 2);

            this._gainNode.gain.linearRampToValueAtTime(gain, this._audioContext.currentTime + tickLength);

            setTimeout(() => this._detectSilence(currentTime, done, attempt + 1), tickLength * 1000);
        }
    }

    public start (sourceId) {
        return this._userMediaService
            .getAudioOnlyMediaStream(sourceId)
            .then((mediaStream) => this._wireInput(mediaStream))
            .then((mediaStream) => {
                this._mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/wav' });

                this._mediaRecorder.start();
            });
    }

    public stop () {
        return this._waitForSilence()
            .then(() => {
                return new Promise((resolve, reject) => {
                    this._mediaRecorder.addEventListener('dataavailable', ({ data }) => resolve(data));
                    this._mediaRecorder.stop();
                });
            });
    }

    private _waitForSilence () {
        return new Promise((resolve) => this._detectSilence(this._audioContext.currentTime, resolve, 0));
    }

    private _wireInput (mediaStream) {
        const mediaStreamAudioSourceNode = this._audioContext.createMediaStreamSource(mediaStream);

        this._gainNode = this._audioContext.createGain();
        this._analyserNode = this._audioContext.createAnalyser();

        const mediaStreamAudioDestinationNode = this._audioContext.createMediaStreamDestination();

        mediaStreamAudioSourceNode
            .connect(this._gainNode)
            .connect(this._analyserNode);

        this._analyserNode
            .connect(mediaStreamAudioDestinationNode);

        this._analyserNode
            .connect(this._audioContext.destination);

        return mediaStreamAudioDestinationNode.stream;
    }

}
