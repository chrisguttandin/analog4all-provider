var connect = require('rxjs-broker').connect;

class Instruments {

    constructor ($http, peerConnectingService) {
        this._$http = $http;
        this._peerConnectingService = peerConnectingService;
    }

    async connect (instrument) {
        var webSocketSubject;

        webSocketSubject = await connect('ws://analog4all-registry.eu-west-1.elasticbeanstalk.com/instruments/' + instrument.id);

        return this._peerConnectingService.connect(webSocketSubject);
    }

    create (data) {
        return new Promise((resolve, reject) => {
            this._$http
                .post('http://analog4all-registry.eu-west-1.elasticbeanstalk.com/instruments', data)
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
                .delete('http://analog4all-registry.eu-west-1.elasticbeanstalk.com/instruments/' + id)
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
                .patch('http://analog4all-registry.eu-west-1.elasticbeanstalk.com/instruments/' + id, delta)
                .success(() => resolve())
                .error((delta, status, headers, config) => {
                    console.log('error while patching an instrument', delta, status, headers, config); // eslint-disable-line no-console

                    reject();
                });
        });
    }

}

module.exports = Instruments;
