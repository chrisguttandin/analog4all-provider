import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { ENDPOINT } from './endpoint-token';
import { ResponseError } from './response-error';

@Injectable()
export class SamplesService {

    constructor (
        @Inject(ENDPOINT) private _endpoint: string,
        private _http: Http
    ) {}

    public create ({ file }: { file: Blob }) {
        return this._http
            .post(`https${ this._endpoint }samples`, null)
            .map((response) => response.json())
            .mergeMap(({ accessKeyId, created, id, modified, policy, signature, url }) => {
                const formData = new FormData();

                formData.append('acl', 'private');
                formData.append('awsaccesskeyid', accessKeyId);
                formData.append('key', `${ id }.wav`);
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
