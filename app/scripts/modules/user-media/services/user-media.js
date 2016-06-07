export class UserMediaService {

    constructor () {
        this._mediaStream = null;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * UserMediaService. The code is roughly copied from [Modernizr's feature detection tests]
     * {@link https://github.com/Modernizr/Modernizr/blob/master/feature-detects/}
     */
    get isSupported () {
        return ('navigator' in window && 'webkitGetUserMedia' in window.navigator);
    }

    getAudioOnlyMediaStream () {
        if (this._mediaStream === null) {
            return new Promise((resolve, reject) => {
                if (this.isSupported) {
                    window.navigator.webkitGetUserMedia({
                        audio: true
                        // @todo request the same device again
                        // audio: {
                        //     optional: [{
                        //         sourceId: deviceId
                        //     }]
                        // }
                    }, (mediaStream) => {
                        this._mediaStream = mediaStream;

                        resolve(mediaStream);
                    }, reject);
                } else {
                    reject();
                }
            });
        }

        return Promise.resolve(this._mediaStream);
    }

}
