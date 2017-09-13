import { Injectable } from '@angular/core';
import { WindowService } from './window.service';

@Injectable()
export class UserMediaService {

    private _mediaStream: null | MediaStream;

    private _window: Window;

    constructor (windowService: WindowService) {
        this._mediaStream = null;
        this._window = windowService.nativeWindow;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * UserMediaService.
     */
    get isSupported () {
        return ('navigator' in this._window &&
            'mediaDevices' in this._window.navigator &&
            'getUserMedia' in this._window.navigator.mediaDevices);
    }

    public getAudioOnlyMediaStream (sourceId: string) {
        if (this._mediaStream !== null) {
            const audioTracks = this._mediaStream.getAudioTracks();

            if (audioTracks.length > 0 && audioTracks[0].id === sourceId) {
                return Promise.resolve(this._mediaStream);
            }
        }

        if (this.isSupported) {
            return this._window.navigator.mediaDevices
                .getUserMedia({
                    audio: {
                        // @todo Theoretically that should be 'sourceId' and not 'deviceId'.
                        deviceId: {
                            exact: sourceId
                            // 'e14cfc130d33a37950726535ddbc23eb0a6cab02f7846ab0f49e46b25bf98d4c'
                        }
                    }
                })
                .then((mediaStream) => {
                    this._mediaStream = mediaStream;

                    return mediaStream;
                });
        }

        return Promise.reject(new Error('Media Capture and Streams are not supported by the current browser.'));
    }

}
