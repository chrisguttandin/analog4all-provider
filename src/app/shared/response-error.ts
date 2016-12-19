import { Response } from '@angular/http';

export class ResponseError extends Error {

    public code: string;

    constructor (response: Response) {
        super();

        const { error: { code, message } } = response.json();

        this.code = code;
        this.message = message;
    }

}
