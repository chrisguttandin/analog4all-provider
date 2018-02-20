import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ISampleResponse } from '../interfaces';
import { ENDPOINT } from './endpoint-token';
import { ResponseError } from './response-error';

@Injectable()
export class SamplesService {

    constructor (
        @Inject(ENDPOINT) private _endpoint: string,
        private _httpClient: HttpClient
    ) {}

    public create ({ file }: { file: Blob }) {
        return this._httpClient
            .post<ISampleResponse>(`https${ this._endpoint }samples`, null)
            .pipe(
                mergeMap(({ accessKeyId, created, id, modified, policy, signature, url }) => {
                    const formData = new FormData();

                    formData.append('acl', 'private');
                    formData.append('awsaccesskeyid', accessKeyId);
                    formData.append('key', `${ id }.wav`);
                    formData.append('policy', policy);
                    formData.append('signature', signature);
                    formData.append('file', file);

                    return this._httpClient
                        .post(url, formData)
                        .pipe(
                            map(() => ({ created, id, modified }))
                        );
                }),
                catchError((response) => Observable.throw(new ResponseError(response)))
            );
    }

}
