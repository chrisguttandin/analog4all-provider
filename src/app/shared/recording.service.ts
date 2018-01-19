import { Injectable } from '@angular/core';
import { MediaRecorder, extend } from 'extendable-media-recorder';
import { wavEncoder } from 'extendable-media-recorder-wav-encoder';
import { UserMediaService } from './user-media.service';

extend(wavEncoder);

const FADE_OUT_OFFSET = 5;

const FADE_OUT_TICKS = 20;

@Injectable()
export class RecordingService {

    private _analyserNode: AnalyserNode;

    private _audioContext: null | AudioContext;

    private _gainNode: GainNode;

    // @todo Use IMediaRecorder once it is exported by extendable-media-recorder.
    private _mediaRecorder: any;

    constructor (private _userMediaService: UserMediaService) {
        this._audioContext = null;
    }

    public start (sourceId: string) {
        if (this._audioContext === null) {
            this._audioContext = new AudioContext();
        }

        return this._userMediaService
            .getAudioOnlyMediaStream(sourceId)
            .then((mediaStream: MediaStream) => this._wireInput(mediaStream))
            .then((mediaStream: MediaStream) => {
                this._mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/wav' });

                this._mediaRecorder.start();
            });
    }

    public stop (): Promise<ArrayBuffer> {
        return this._waitForSilence()
            .then(() => {
                return new Promise<ArrayBuffer>((resolve) => {
                    this._mediaRecorder.addEventListener('dataavailable', ({ data }: any) => resolve(data));
                    this._mediaRecorder.stop();
                });
            });
    }

    private _detectSilence (currentTime: number, done: Function, attempt: number) {
        if (this._audioContext === null) {
            throw new Error('Expected an initialized AudioContext.');
        }

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

    private _waitForSilence () {
        return new Promise((resolve) => {
            if (this._audioContext === null) {
                throw new Error('Expected an initialized AudioContext.');
            }

            this._detectSilence(this._audioContext.currentTime, resolve, 0);
        });
    }

    private _wireInput (mediaStream: MediaStream) {
        if (this._audioContext === null) {
            throw new Error('Expected an initialized AudioContext.');
        }

        const mediaStreamAudioSourceNode = this._audioContext.createMediaStreamSource(mediaStream);

        this._gainNode = this._audioContext.createGain();
        this._analyserNode = this._audioContext.createAnalyser();

        const mediaStreamAudioDestinationNode = (<any> this._audioContext).createMediaStreamDestination();

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
