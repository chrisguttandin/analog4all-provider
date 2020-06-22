import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ISampleResponse } from '../interfaces';
import { ENDPOINT } from './endpoint-token';
import { ResponseError } from './response-error';

@Injectable({
    providedIn: 'root'
})
export class SamplesService {
    constructor(@Inject(ENDPOINT) private _endpoint: string, private _httpClient: HttpClient) {}

    public create({ file }: { file: Blob }): Observable<{ created: number; id: string; modified: number }> {
        return this._httpClient.post<ISampleResponse>(`https${this._endpoint}samples`, null).pipe(
            mergeMap(({ created, id, modified, url }) => this._httpClient.put(url, file).pipe(map(() => ({ created, id, modified })))),
            catchError((response) => throwError(new ResponseError(response)))
        );
    }
}
