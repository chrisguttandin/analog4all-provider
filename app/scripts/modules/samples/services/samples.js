class Instruments {

    constructor ($http) {
        this._$http = $http;
    }

    create (data) {
        var file = data.file;

        return new Promise((resolve, reject) => {
            this._$http
                .post('https://analog4all-registry.eu-west-1.elasticbeanstalk.com/samples')
                .success((data) => {
                    var formData,
                        request;

                    formData = new FormData();
                    request = new XMLHttpRequest();

                    formData.append('acl', 'private');
                    formData.append('awsaccesskeyid', data.accessKeyId);
                    formData.append('key', data.id + '.wav');
                    formData.append('policy', data.policy);
                    formData.append('signature', data.signature);
                    formData.append('file', file);

                    request.onerror = () => reject();
                    request.onload = () => resolve(data);

                    request.open('POST', data.url);

                    request.send(formData);
                })
                .error((data, status, headers, config) => {
                    console.log('error while creating an sample', data, status, headers, config); // eslint-disable-line no-console

                    reject();
                });
        });
    }

}

module.exports = Instruments;
