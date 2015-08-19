'use strict';

class UserMediaService {

    constructor () {
        this._mediaStream = null;
    }

    getAudioOnlyMediaStream () {
        if (this._mediaStream === null) {
            return new Promise((resolve, reject) => {
                if (!(window.navigator) || !(window.navigator.webkitGetUserMedia)) {
                    reject();
                } else {
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
                }
            });
        } else {
            return Promise.resolve(this._mediaStream);
        }
    }

}

module.exports = UserMediaService;
