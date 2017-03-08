import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ResponseError } from './response-error';

const ENDPOINT = 'analog4all-registry.eu-west-1.elasticbeanstalk.com/';

@Injectable()
export class SamplesService {

    constructor (
        private _http: Http
    ) {}

    public create ({ file }) {
        return this._http
            .post(`${ ENDPOINT }samples`, null)
            .map((response) => response.json())
            .mergeMap(({ accessKeyId, created, id, modified, policy, signature, url }) => {
                const formData = new FormData();

                formData.append('acl', 'private');
                formData.append('awsaccesskeyid', accessKeyId);
                formData.append('key', id + '.wav');
                formData.append('policy', policy);
                formData.append('signature', signature);
                formData.append('file', file);

                return this._http
                    .post(url, formData)
                    .map(() => ({ created, id, modified }));
            })
            .catch((response) => Observable.throw(new ResponseError(response)));
    }

}
