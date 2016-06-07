import { connect } from 'rxjs-broker';

export class InstrumentsService {

    constructor ($http, peerConnectingService) {
        this._$http = $http;
        this._peerConnectingService = peerConnectingService;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * InstrumentsService. The code is roughly copied from [Modernizr's feature detection tests]
     * {@link https://github.com/Modernizr/Modernizr/blob/master/feature-detects/}
     */
    get isSupported () {
        if ('WebSocket' in window && 'webkitRTCPeerConnection' in window) {
            /* eslint-disable indent */
            let peerConnection = new webkitRTCPeerConnection({ // eslint-disable-line new-cap, no-undef
                    iceServers: [{ url: 'stun:0' }]
                });
            /* eslint-enable indent */

            return 'createDataChannel' in peerConnection;
        }

        return false;
    }

    async connect (instrument) {
        var webSocketSubject;

        webSocketSubject = await connect('wss://analog4all-registry.eu-west-1.elasticbeanstalk.com/instruments/' + instrument.id);

        return this._peerConnectingService.connect(webSocketSubject);
    }

    create (data) {
        return new Promise((resolve, reject) => {
            this._$http
                .post('https://analog4all-registry.eu-west-1.elasticbeanstalk.com/instruments', data)
                .success((data) => resolve(data))
                .error((data, status, headers, config) => {
                    console.log('error while creating an instrument', data, status, headers, config); // eslint-disable-line no-console

                    reject();
                });
        });
    }

    delete (id) {
        return new Promise((resolve, reject) => {
            this._$http
                .delete('https://analog4all-registry.eu-west-1.elasticbeanstalk.com/instruments/' + id)
                .success(() => resolve())
                .error((data, status, headers, config) => {
                    console.log('error while deleting an instrument', data, status, headers, config); // eslint-disable-line no-console

                    reject();
                });
        });
    }

    update (id, delta) {
        return new Promise((resolve, reject) => {
            this._$http
                .patch('https://analog4all-registry.eu-west-1.elasticbeanstalk.com/instruments/' + id, delta)
                .success(() => resolve())
                .error((delta, status, headers, config) => {
                    console.log('error while patching an instrument', delta, status, headers, config); // eslint-disable-line no-console

                    reject();
                });
        });
    }

}
