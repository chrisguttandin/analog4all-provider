import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
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
            .pipe(
                map<any, any>((response) => response.json()),
                mergeMap(({ accessKeyId, created, id, modified, policy, signature, url }) => {
                    const formData = new FormData();

                    formData.append('acl', 'private');
                    formData.append('awsaccesskeyid', accessKeyId);
                    formData.append('key', `${ id }.wav`);
                    formData.append('policy', policy);
                    formData.append('signature', signature);
                    formData.append('file', file);

                    return this._http
                        .post(url, formData)
                        .pipe(
                            map(() => ({ created, id, modified }))
                        );
                }),
                catchError((response) => Observable.throw(new ResponseError(response)))
            );
    }

}
